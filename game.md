```cpp
diff --git a/base/qml/WebOSCompositorBase/Services.qml b/base/qml/WebOSCompositorBase/Services.qml
index a152aa19..39230ae7 100644
--- a/base/qml/WebOSCompositorBase/Services.qml
+++ b/base/qml/WebOSCompositorBase/Services.qml
@@ -46,5 +46,25 @@ Item {
         onLaunchHomeApp: {
             LS.adhoc.call("luna://com.webos.applicationManager", "/launch", JSON.stringify({"id":"com.webos.app.home"}));
         }
+
+        onLaunchSystemUI: (isLaunch) => {
+            var appId = "com.webos.app.touchremote"
+            if (isLaunch) {
+                console.info("[THANGTEST] request to launch system UI");
+                var appFile = "file://usr/lib/qml/TouchRemote/Main.qml"
+                var params = JSON.stringify({
+                    "appId": appId,
+                    "main": testAppFile,
+                    "params": "{\"position\": \"rightbottom\"}"
+                })
+                LS.adhoc.call("luna://com.webos.service.sysuicompmgr", "/launch", params);
+            } else {
+                console.info("[THANGTEST] request to close system UI");
+                var params = JSON.stringify({
+                    "appId": appId
+                });
+                LS.adhoc.call("luna://com.webos.service.sysuicompmgr", "/close", params);
+            }
+        }
     }
 }
diff --git a/base/qml/WebOSCompositorBase/global/LS.qml b/base/qml/WebOSCompositorBase/global/LS.qml
index 52d5e8ae..70e9bf12 100644
--- a/base/qml/WebOSCompositorBase/global/LS.qml
+++ b/base/qml/WebOSCompositorBase/global/LS.qml
@@ -73,6 +73,21 @@ QtObject {
                 appInfoList = newList;
             }
         }
+
+        //thang2.vo
+        onLaunchPointsListChanged: {
+            var res = JSON.parse(launchPointsList);
+            if (res.launchPoints) {
+                var newList = [];
+                for (var i = 0; i < res.launchPoints.length; i++) {
+                    if (res.launchPoints[i].id)
+                        newList.push(res.launchPoints[i].id);
+                }
+                
+                compositor.launchPoints = newList;
+            }
+        }
+        //thang2.vo
     }
 
     readonly property AudioService audioService: AudioService {
diff --git a/modules/weboscompositor/input/waylandinputmethod.cpp b/modules/weboscompositor/input/waylandinputmethod.cpp
old mode 100755
new mode 100644
diff --git a/modules/weboscompositor/input/waylandinputmethod.h b/modules/weboscompositor/input/waylandinputmethod.h
old mode 100755
new mode 100644
diff --git a/modules/weboscompositor/input/waylandtextmodel.cpp b/modules/weboscompositor/input/waylandtextmodel.cpp
old mode 100755
new mode 100644
diff --git a/modules/weboscompositor/weboscorecompositor.h b/modules/weboscompositor/weboscorecompositor.h
index a07df016..424fb884 100644
--- a/modules/weboscompositor/weboscorecompositor.h
+++ b/modules/weboscompositor/weboscorecompositor.h
@@ -76,6 +76,7 @@ class WEBOS_COMPOSITOR_EXPORT WebOSCoreCompositor : public QWaylandQuickComposit
     Q_PROPERTY(WebOSSurfaceItem* activeSurface READ activeSurface NOTIFY activeSurfaceChanged)
 
     Q_PROPERTY(QList<QObject *> foregroundItems READ foregroundItems NOTIFY foregroundItemsChanged)
+    Q_PROPERTY(QList<QString> launchPoints READ launchPoints WRITE setLaunchPoints NOTIFY launchPointsChanged) //thang2.vo
 
 public:
     enum ExtensionFlag {
@@ -141,6 +142,18 @@ public:
     bool mouseEventEnabled() { return m_mouseEventEnabled; }
     void setMouseEventEnabled(bool enable);
 
+    //thang2.vo
+    QList<QString> launchPoints() const {
+        return m_launchPoints;
+    }
+    void setLaunchPoints(const QList<QString> &launchPoints) {
+        if (m_launchPoints != launchPoints) {
+            m_launchPoints = launchPoints;
+            emit launchPointsChanged();
+        }
+    }
+    //thang2.vo
+
 #ifdef MULTIINPUT_SUPPORT
     QWaylandSeat *queryInputDevice(QInputEvent *inputEvent);
 #endif
@@ -240,6 +253,8 @@ signals:
     void launchHomeApp();
     void lsmReady();
     void eventLoopReady();
+    void launchPointsChanged(); //thang2.vo
+    void launchSystemUI(bool isLaunch); //thang2.vo
 
 protected:
     virtual void surfaceCreated(QWaylandSurface *surface);
@@ -336,6 +351,8 @@ private:
     EventPreprocessor* m_eventPreprocessor;
 
     QRect m_outputGeometry;
+    
+    QList<QString> m_launchPoints; //thang2.vo
 };
 
 #endif // WEBOSCORECOMPOSITOR_H
diff --git a/modules/weboscompositor/webossurfaceitem.cpp b/modules/weboscompositor/webossurfaceitem.cpp
index 0b34b271..06dc9fbb 100644
--- a/modules/weboscompositor/webossurfaceitem.cpp
+++ b/modules/weboscompositor/webossurfaceitem.cpp
@@ -334,6 +334,16 @@ void WebOSSurfaceItem::wheelEvent(QWheelEvent *event)
 
 void WebOSSurfaceItem::touchEvent(QTouchEvent *event)
 {
+    //thang2.vo
+    bool touchOnCPApp = false;
+    static bool systemUIisLaunched = false;
+    if (m_compositor->launchPoints().contains(appId())) {
+        touchOnCPApp = true;
+        qInfo() << "[THANGTEST] touch event on app is CP App => " << touchOnCPApp; 
+    } else {
+        qInfo() << "[THANGTEST] touch event on app is CP App => " << touchOnCPApp;
+    }
+    //thang2.vo
     QTouchEvent e(event->type(), event->device(), event->modifiers(),
                   event->touchPointStates(), mapToTarget(event->touchPoints()));
     e.setWindow(event->window());
@@ -386,8 +396,20 @@ void WebOSSurfaceItem::touchEvent(QTouchEvent *event)
         }
         if (e.touchPointStates() & Qt::TouchPointPressed)
             qInfo() << "[TOUCH:TouchPointPressed] appId:" << appId();
-        else if (e.touchPointStates() & Qt::TouchPointReleased)
+        else if (e.touchPointStates() & Qt::TouchPointReleased) {
             qInfo() << "[TOUCH:TouchPointReleased] appId:" << appId();
+            //thang2.vo
+            if (touchOnCPApp && !systemUIisLaunched) {
+                qInfo() << "[THANGTEST] call to launch system UI";
+                systemUIisLaunched = true;
+                emit m_compositor->launchSystemUI(true);
+            } else if (!touchOnCPApp && systemUIisLaunched) {
+                qInfo() << "[THANGTEST] call to close system UI";
+                systemUIisLaunched = false;
+                emit m_compositor->launchSystemUI(false);
+            }
+            //thang2.vo
+        }
         seat->sendFullTouchEvent(surface(), &e);
     } else {
         QWaylandQuickItem::touchEvent(event);
```