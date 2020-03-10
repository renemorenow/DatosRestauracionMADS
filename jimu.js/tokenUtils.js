// All material copyright ESRI, All Rights Reserved, unless otherwise specified.
// See http://js.arcgis.com/3.15/esri/copyright.txt and http://www.arcgis.com/apps/webappbuilder/copyright.txt for details.

//>>built
define("dojo/_base/lang dojo/_base/array dojo/aspect dojo/Deferred dojo/cookie dojo/json dojo/topic dojo/request/script esri/kernel esri/config esri/request esri/urlUtils esri/sniff esri/IdentityManager esri/arcgis/OAuthInfo jimu/portalUrlUtils jimu/utils esri/layers/vectorTiles/kernel".split(
  " "
), function(d, h, t, n, l, u, p, q, e, m, v, w, y, r, z, f, x, A) {
  "function" !== typeof l.getAll &&
    (l.getAll = function(a) {
      var b = [];
      (a = l(a)) && b.push(a);
      return b;
    });
  r = {
    portalUrl: null,
    cookiePath: "/",
    _started: !1,
    webTierPortalUrls: [],
    isInBuilderWindow: function() {
      return !!window.isBuilder;
    },
    isInConfigOrPreviewWindow: function() {
      return x.isInConfigOrPreviewWindow();
    },
    isStringStartWith: function(a, b) {
      return a.substr(0, b.length) === b;
    },
    getCookiePath: function() {
      return this.cookiePath;
    },
    setPortalUrl: function(a) {
      (a = f.getStandardPortalUrl(a)) && (a += "/");
      this.portalUrl = a;
    },
    getPortalUrl: function() {
      return this.portalUrl;
    },
    isWebTierPortal: function(a) {
      var b = new n(),
        c = f.getStandardPortalUrl(a);
      a = c + "/sharing";
      var g = f.setHttpsProtocol(c + "/sharing/generateToken?f\x3djson"),
        k = f.setHttpsProtocol(a);
      q.get(g, { jsonp: "callback" }).then(
        d.hitch(this, function(a) {
          a.token
            ? (this.webTierPortalUrls.push(c),
              this.removeWabAuthCookie(),
              e.id.getCredential(k).then(
                d.hitch(this, function(d) {
                  function e(a) {
                    var b = a.creationTime || new Date().getTime(),
                      c = a.expires;
                    0 < b &&
                      0 < c &&
                      c > b &&
                      setTimeout(function() {
                        q.get(g, { jsonp: "callback" }).then(
                          function(b) {
                            b.token &&
                              ((a.token = b.token),
                              (a.expires = b.expires),
                              (a.creationTime = new Date().getTime()),
                              a.refreshServerTokens(),
                              e(a));
                          },
                          function(a) {
                            console.error(a);
                          }
                        );
                      }, 0.8 * (c - b));
                  }
                  d.token || (d.token = a.token);
                  d.expires || (d.expires = a.expires);
                  var k = this.findServerFromCorsEnabledServers(d.server);
                  -1 < k && m.defaults.io.corsEnabledServers.splice(k, 1);
                  this._pushCorsEnabledServerInfo({
                    host: f.getServerByUrl(c),
                    withCredentials: !0
                  });
                  b.resolve(!0);
                  e(d);
                }),
                d.hitch(this, function() {
                  b.resolve(!0);
                })
              ))
            : b.resolve(!1);
        }),
        d.hitch(this, function(a) {
          console.error(a);
          b.reject(a);
        })
      );
      return b;
    },
    addAuthorizedCrossOriginDomains: function(a) {
      if (a && 0 < a.length)
        for (var b = 0; b < a.length; b++) this.addWithCredentialDomain(a[b]);
    },
    addWithCredentialDomain: function(a) {
      if (a && "string" === typeof a) {
        var b = m.defaults.io.corsEnabledServers,
          c = f.getServerByUrl(a);
        (a = f.getServerWithProtocol(a)) || (a = "http://" + c);
        a = this.findServerFromCorsEnabledServers(a);
        -1 < a && b.splice(a, 1);
        this._pushCorsEnabledServerInfo({ host: c, withCredentials: !0 });
      }
    },
    findServerFromCorsEnabledServers: function(a) {
      var b = m.defaults.io.corsEnabledServers,
        c,
        d = -1;
      y("esri-cors") &&
        b &&
        b.length &&
        h.some(b, function(b, e) {
          b = !b || "object" !== typeof b || b instanceof RegExp ? b : b.host;
          return !(b instanceof RegExp) &&
            b &&
            ((c =
              0 !==
              b
                .trim()
                .toLowerCase()
                .indexOf("http")),
            w.hasSameOrigin(a, c ? "http://" + b : b) ||
              (c && w.hasSameOrigin(a, "https://" + b)))
            ? ((d = e), !0)
            : !1;
        });
      return d;
    },
    _pushCorsEnabledServerInfo: function(a) {
      if (a) {
        var b = m.defaults.io.corsEnabledServers,
          c = "charAt charCodeAt concat endsWith indexOf lastIndexOf localeCompare match replace search slice split startsWith substr substring toLocaleLowerCase toLocaleUpperCase toLowerCase toString toUpperCase trim trimLeft trimRight valueOf".split(
            " "
          );
        if ("object" === typeof a && "string" === typeof a.host) {
          for (var d in a.host)
            a[d] =
              "function" === typeof a.host[d]
                ? function() {
                    return a.host[d].apply(a.host, arguments);
                  }
                : a.host[d];
          a.length = a.host.length;
          h.forEach(c, function(b) {
            "function" === typeof a.host[b] &&
              (a[b] = function() {
                return a.host[b].apply(a.host, arguments);
              });
          });
        }
        b.push(a);
      }
    },
    tryRegisterCredential: function(a) {
      return this.isValidCredential(a)
        ? h.some(
            e.id.credentials,
            d.hitch(this, function(b) {
              return a.token === b.token;
            })
          )
          ? !1
          : (e.id.credentials.push(a), !0)
        : !1;
    },
    registerToken: function(a) {
      var b = f.getSharingUrl(this.portalUrl);
      e.id.findCredential(b) &&
        h.some(
          e.id.credentials,
          d.hitch(this, function(a, b) {
            if (this.isValidPortalCredentialOfPortalUrl(this.portalUrl, a))
              return e.id.credentials.splice(b, 1), !0;
          })
        );
      return this._getTokenInfo(a).then(function(a) {
        a && e.id.registerToken(a);
      });
    },
    _getTokenInfo: function(a) {
      var b = f.getPortalSelfInfoUrl(this.portalUrl);
      return q
        .get(b + ("?f\x3djson\x26token\x3d" + a), { jsonp: "callback" })
        .then(
          d.hitch(this, function(b) {
            return b.user
              ? {
                  server: f.getSharingUrl(this.portalUrl),
                  ssl: b.allSSL,
                  token: a,
                  userId: b.user.username
                }
              : null;
          }),
          function(a) {
            console.error(a);
            throw Error(window.jimuNls.urlParams.validateTokenError);
          }
        );
    },
    _isInvalidPortalUrl: function(a) {
      return a && "string" === typeof a && d.trim(a);
    },
    signInPortal: function(a) {
      var b = new n();
      if (this._isInvalidPortalUrl(a)) {
        a = f.getStandardPortalUrl(a);
        var c = f.getSharingUrl(a),
          g = this.getPortalCredential(a);
        g
          ? setTimeout(
              d.hitch(this, function() {
                b.resolve(g);
              }),
              0
            )
          : (b = e.id.getCredential(c));
      } else
        setTimeout(
          d.hitch(this, function() {
            b.reject("Invalid portalurl.");
          }),
          0
        );
      return b;
    },
    _loadPortalSelfInfo: function(a) {
      a = f.getPortalSelfInfoUrl(a);
      return v({
        url: a,
        handleAs: "json",
        content: { f: "json" },
        callbackParamName: "callback"
      });
    },
    registerOAuthInfo: function(a, b) {
      if (!a || "string" !== typeof a || !b || "string" !== typeof b)
        return null;
      var c = e.id.findOAuthInfo(a);
      c ||
        ((c =
          window.location.protocol +
          "//" +
          window.location.host +
          require.toUrl("jimu") +
          "/oauth-callback.html"),
        (c = new z({
          appId: b,
          expiration: 20159,
          portalUrl: a,
          authNamespace: "/",
          popup: !0,
          popupCallbackUrl: c
        })),
        e.id.registerOAuthInfos([c]));
      c.appId = b;
      return c;
    },
    signOutAll: function() {
      var a = f.getStandardPortalUrl(this.portalUrl),
        b = !!e.id.findCredential(a + "/sharing/rest");
      window.appInfo.isRunInPortal
        ? this.removeEsriAuthCookieStorage()
        : this.removeWabAuthCookie();
      e.id.destroyCredentials();
      e.id._oAuthHash = null;
      b && this._publishCurrentPortalUserSignOut(a);
    },
    userHaveSignInPortal: function(a) {
      return !!this.getPortalCredential(d.trim(a || ""));
    },
    isValidCredential: function(a) {
      var b = !1;
      if (a) {
        var b = a.token,
          c = a.server,
          e = a.scope,
          b = b && "string" === typeof b && d.trim(b),
          c = c && "string" === typeof c && d.trim(c),
          e = "portal" === e || "server" === e,
          f = !0;
        a.expires &&
          ((a = parseInt(a.expires, 10)),
          (f = new Date().getTime()),
          (f = a > f));
        b = b && c && e && f;
      }
      return b;
    },
    isValidPortalCredentialOfPortalUrl: function(a, b) {
      var c = !1;
      this.isValidCredential(b) &&
        ((c = "portal" === b.scope),
        (a = f.isSameServer(a, b.server)),
        (c = c && a));
      return c;
    },
    getPortalCredential: function(a) {
      var b = null;
      a = d.trim(a || "");
      if (!a) return null;
      a = f.getStandardPortalUrl(a);
      (b = this._filterPortalCredential(a, e.id.credentials)) ||
        this._tryConvertArcGIScomCrendentialToOrgCredential();
      return b;
    },
    _tryConvertArcGIScomCrendentialToOrgCredential: function() {
      var a = this.portalUrl;
      if (
        a &&
        ((a = f.getStandardPortalUrl(a)),
        f.isOrgOnline(a) && !this._filterPortalCredential(a, e.id.credentials))
      ) {
        var b = this._filterPortalCredential(
          "http://www.arcgis.com",
          e.id.credentials
        );
        b &&
          e.id.registerToken({
            token: b.token,
            scope: "portal",
            userId: b.userId,
            server: a + "/sharing/rest",
            expires: b.expires
          });
      }
    },
    saveAndRegisterCookieToCredential: function(a) {
      a = d.clone(a);
      a.referer = window.location.host;
      a.scope = "portal";
      a.isAdmin = !!a.isAdmin;
      this.saveWabCookie(a);
      var b = a.server + "/sharing/rest";
      a.server = b;
      e.id.registerToken(a);
      return e.id.findCredential(b, a.userId);
    },
    registerAuth2Hash: function(a) {
      a = d.clone(a);
      var b = 1e3 * parseInt(a.expires_in, 10),
        b = new Date().getTime() + b,
        c = f.getStandardPortalUrl(a.state.portalUrl);
      return this.saveAndRegisterCookieToCredential({
        referer: window.location.host,
        server: c,
        token: a.access_token,
        expires: b,
        userId: a.username,
        scope: "portal",
        isAdmin: !!a.isAdmin
      });
    },
    saveWabCookie: function(a) {
      this.removeCookie("wab_auth");
      l("wab_auth", u.stringify(a), {
        expires: new Date(a.expires),
        path: "/"
      });
    },
    removeWabAuthCookie: function() {
      this.removeCookie("wab_auth");
    },
    removeEsriAuthCookieStorage: function() {
      this.removeCookie("esri_auth");
      window.localStorage && window.localStorage.removeItem("esriJSAPIOAuth");
      window.sessionStorage &&
        window.sessionStorage.removeItem("esriJSAPIOAuth");
    },
    _filterPortalCredential: function(a, b) {
      var c = null;
      a = f.getStandardPortalUrl(a);
      b &&
        0 < b.length &&
        ((b = h.filter(
          b,
          d.hitch(this, function(b) {
            return this.isValidPortalCredentialOfPortalUrl(a, b);
          })
        )),
        0 < b.length && (c = b[b.length - 1]));
      return c;
    },
    _removePortalCredential: function(a) {
      var b = d.trim(a || "");
      if (b) {
        b = f.getStandardPortalUrl(b);
        for (
          a = h.filter(
            e.id.credentials,
            d.hitch(this, function(a) {
              return this.isValidPortalCredentialOfPortalUrl(b, a);
            })
          );
          0 < a.length;

        )
          a[0].destroy(), a.splice(0, 1);
        e.id.credentials = h.filter(
          e.id.credentials,
          d.hitch(this, function(a) {
            return !this.isValidPortalCredentialOfPortalUrl(b, a);
          })
        );
      }
    },
    getUserIdByToken: function(a, b) {
      var c = new n();
      if (a && "string" === typeof a && b && "string" === typeof b) {
        var g = f.getStandardPortalUrl(b);
        b = h.filter(
          e.id.credentials,
          d.hitch(this, function(b) {
            var c = b.token === a && b.userId;
            b = f.isSameServer(g, b.server);
            return c && b;
          })
        );
        if (0 < b.length) {
          var k = b[0];
          setTimeout(
            d.hitch(this, function() {
              c.resolve(k.userId);
            }),
            0
          );
          return c;
        }
        b = f.getCommunitySelfUrl(g);
        v({
          url: b,
          handleAs: "json",
          content: { f: "json" },
          callbackParamName: "callback"
        }).then(
          d.hitch(this, function(a) {
            c.resolve((a && a.username) || "");
          }),
          d.hitch(this, function(a) {
            console.error(a);
            c.reject("fail to get userId by token");
          })
        );
      } else
        setTimeout(
          d.hitch(this, function() {
            c.reject("invalid parameters");
          }),
          0
        );
      return c;
    },
    xtGetCredentialFromCookie: function(a) {
      var b = l("wab_auth"),
        c = null;
      if (b)
        try {
          c = u.parse(b);
        } catch (g) {
          console.error(g);
        }
      if (
        !c ||
        "object" !== typeof c ||
        !f.isSameServer(a, c.server) ||
        window.location.host !== c.referer
      )
        return null;
      c.expires = parseInt(c.expires, 10);
      b = new Date().getTime();
      if (!(c.expires > b)) return this.removeCookie("wab_auth"), null;
      a += "/sharing/rest";
      c.server = a;
      (b = e.id.findCredential(a)) || e.id.registerToken(c);
      return (b = e.id.findCredential(a));
    },
    removeCookie: function(a) {
      var b = this.getCookiePath();
      x.removeCookie(a, b);
    },
    _getDomainsByServerName: function(a) {
      var b = a.split("."),
        c = b.length;
      return h.map(
        b,
        d.hitch(this, function(a, e) {
          a = b.slice(e, c);
          var f = "",
            g = a.length - 1;
          h.forEach(
            a,
            d.hitch(this, function(a, b) {
              f += a;
              b !== g && (f += ".");
            })
          );
          return f;
        })
      );
    },
    _publishCurrentPortalUserSignIn: function(a) {
      if (this.isValidCredential(a))
        try {
          p.publish("userSignIn", a);
        } catch (b) {
          console.error(b);
        }
    },
    _publishAnyUserSignIn: function(a) {
      if (this.isValidCredential(a))
        try {
          p.publish("anyUserSignIn", a);
        } catch (b) {
          console.error(b);
        }
    },
    _publishCurrentPortalUserSignOut: function(a) {
      try {
        p.publish("userSignOut", a);
      } catch (b) {
        console.error(b);
      }
    },
    _signInSuccess: function(a) {
      try {
        this.isValidPortalCredentialOfPortalUrl(this.portalUrl, a) &&
          this._publishCurrentPortalUserSignIn(a),
          this._publishAnyUserSignIn(a);
      } catch (b) {
        console.error(b);
      }
    },
    _bindEvents: function() {
      t.after(
        e.id,
        "signIn",
        d.hitch(this, function(a, b) {
          console.log(b[1]);
          t.after(
            a,
            "callback",
            d.hitch(this, function(a, b) {
              this._signInSuccess(b[0], !1);
            })
          );
          return a;
        })
      );
    },
    isStart: function() {
      return this._started;
    },
    startup: function() {
      if (!this._started) {
        if (this.isInConfigOrPreviewWindow()) {
          var a = window.parent;
          if (a) {
            var b = a.esri && a.esri.id;
            b._wab = "builder";
            if (b) {
              e.id = b;
              var c = window.esriConfig.defaults.io,
                a = a.esriConfig.defaults.io;
              c.corsEnabledServers = a.corsEnabledServers;
              c.webTierAuthServers = a.webTierAuthServers;
              c._processedCorsServers = a._processedCorsServers;
              c.corsStatus = a.corsStatus;
              Object.defineProperty(A, "id", {
                get: function() {
                  return b;
                },
                enumerable: !0,
                configurable: !0
              });
            }
          }
        }
        this._bindEvents();
        this._started = !0;
      }
    }
  };
  r.startup();
  return r;
});
