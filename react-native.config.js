module.exports = {
  dependencies: {
    'uilib-native': {
      platforms: {
        android: {
          // React Native 0.88 qualifies only the first import. Use fully
          // qualified names so every UI Lib native package stays on the classpath.
          packageImportPath: '// packages are referenced by fully qualified name',
          packageInstance: `new com.wix.reactnativeuilib.dynamicfont.DynamicFontPackage(),
      new com.wix.reactnativeuilib.highlighterview.HighlighterViewPackage(),
      new com.wix.reactnativeuilib.keyboardinput.KeyboardInputPackage(getApplication())`,
        },
      },
    },
  },
};
