# Template System

This directory contains template files for code generation. Using separate template files instead of template literals provides:

## Benefits

1. **Better Readability** - Template files are easier to read and edit
2. **No Escaping Issues** - Write actual code without worrying about escaping quotes
3. **Syntax Highlighting** - Your editor can highlight the template files properly
4. **Easier Maintenance** - Fix bugs by editing the template file directly
5. **Reusable** - Template snippets can be composed together

## Usage

Templates use Handlebars-style placeholders: `{{variableName}}`

Example:
```
import { {{functionName}} } from '{{modulePath}}';
```

## Template Structure

- `*.hbs` - Template files (Handlebars-style placeholders)
- `utils.ts` - Helper functions for loading and processing templates
- `new-templates.ts` - New template functions using the file-based approach

## Migration Path

1. Start using new template functions alongside old ones
2. Gradually migrate templates to files
3. Eventually replace old template literals

