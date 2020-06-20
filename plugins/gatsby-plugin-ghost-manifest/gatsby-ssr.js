"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

var _react = _interopRequireDefault(require("react"));

var _gatsby = require("gatsby");

var _common = require("./common.js");

exports.onRenderBody = function (_ref, pluginOptions) {
  var setHeadComponents = _ref.setHeadComponents;
  const setPreBodyComponents = _ref.setPreBodyComponents;
  // We use this to build a final array to pass as the argument to setHeadComponents at the end of onRenderBody.
  var headComponents = [];
  var icons = pluginOptions.icons || _common.defaultIcons; // If icons were generated, also add a favicon link.

  if (pluginOptions.icon) {
    var favicon = icons && icons.length ? icons[0].src : null;

    if (favicon) {
      headComponents.push(_react.default.createElement("link", {
        key: "gatsby-plugin-manifest-icon-link",
        rel: "shortcut icon",
        href: (0, _gatsby.withPrefix)(favicon)
      }));
    }
  } // Add manifest link tag.


  headComponents.push(_react.default.createElement("link", {
    key: "gatsby-plugin-manifest-link",
    rel: "manifest",
    href: (0, _gatsby.withPrefix)("/manifest.webmanifest")
  })); // The user has an option to opt out of the theme_color meta tag being inserted into the head.

  if (pluginOptions.theme_color) {
    var insertMetaTag = Object.keys(pluginOptions).includes("theme_color_in_head") ? pluginOptions.theme_color_in_head : true;

    if (insertMetaTag) {
      headComponents.push(_react.default.createElement("meta", {
        key: "gatsby-plugin-manifest-meta",
        name: "theme-color",
        content: pluginOptions.theme_color
      }));
    }
  }

  if (pluginOptions.legacy) {
    var iconLinkTags = icons.map(function (icon) {
      return _react.default.createElement("link", {
        key: "gatsby-plugin-manifest-apple-touch-icon-" + icon.sizes,
        rel: "apple-touch-icon",
        sizes: icon.sizes,
        href: (0, _gatsby.withPrefix)("" + icon.src)
      });
    });
    headComponents = [].concat(headComponents, iconLinkTags);
  }

  setHeadComponents(headComponents);
  setPreBodyComponents([
    _react.default.createElement("script", {
          dangerouslySetInnerHTML: {
              __html: `
                (() => {
                  window.__onThemeChange = function() {};
                  function setTheme(newTheme) {
                    window.__theme = newTheme;
                    preferredTheme = newTheme;
                    document.body.className = newTheme;
                    window.__onThemeChange(newTheme);
                  }

                  let preferredTheme
                  try {
                    preferredTheme = localStorage.getItem('theme')
                  } catch (err) {}

                  window.__setPreferredTheme = newTheme => {
                    setTheme(newTheme)
                    try {
                      localStorage.setItem('theme', newTheme)
                    } catch (err) {}
                  }

                  let darkQuery = window.matchMedia('(prefers-color-scheme: light)')
                  darkQuery.addListener(e => {
                    window.__setPreferredTheme(e.matches ? 'light' : 'dark')
                  })

                  setTheme(preferredTheme || (darkQuery.matches ? 'light' : 'dark'))
                })()
          `,
          },
      }),
  ]);
};