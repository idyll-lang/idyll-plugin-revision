# idyll-plugin-revision

Idyll plugin to display git revision information

## Author

- [Christian Frisson](http://frisson.re)

## Installation

```
npm install https://github.com/ChristianFrisson/idyll-plugin-revision.git --save-dev
```

Add it to your idyll configuration in `package.json`:

```json
"idyll": {
  "compiler": {
    "postProcessors": ["idyll-plugin-revision"]
  }
}
```

## Usage

To use the plugin place `[Revision /]` where you want the revision information to appear in your document. 
