# Advanced Markdown Syntax

## 1. Tables
```markdown
| Header 1 | Header 2 | Header 3 |
|----------|----------|----------|
| Row 1    | Data     | Data     |
| Row 2    | Data     | Data     |
```

## 2. Code Blocks with Syntax Highlighting
```markdown
```language
// Example code
function helloWorld() {
    console.log("Hello, World!");
}
```
```

## 3. Task Lists
```markdown
- [x] Completed Task
- [ ] Incomplete Task
```

## 4. Footnotes
```markdown
This is a sentence with a footnote.[^1]

[^1]: This is the footnote text.
```

## 5. Definition Lists
```markdown
Term 1
: Definition for Term 1

Term 2
: Definition for Term 2
```

## 6. Strikethrough
```markdown
~~This text is strikethrough~~
```

## 7. Links with Titles
```markdown
[GitHub](https://github.com "Visit GitHub")
```

## 8. Images with Titles
```markdown
![Alt Text](image_url "Image Title")
```

## 9. Inline HTML
```markdown
<div style="color: red;">This is red text.</div>
```

## 10. Emoji Support
```markdown
:smile: :rocket: :tada:
```

## 11. Escaping Characters
```markdown
\*This text is not italicized\*
```

## 12. Blockquotes with Nested Elements
```markdown
> This is a blockquote.
> - Nested list item
> - Another item
```

## 13. Horizontal Rules
```markdown
---
```

## 14. Custom IDs for Headings
```markdown
### Heading with ID {#custom-id}
```

## 15. Math Expressions (if supported)
```markdown
$$
E = mc^2
$$
```