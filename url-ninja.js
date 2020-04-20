window._url = (function(window) {
  function checkIfKeyIsArray(key) {
    return key.slice("-2") === "[]";
  }

  function parseUrl(params) {
    const paramsMap = {};
    let l = window.location.search;
    let h = window.location.hash;

    function paramsMapAssign(key, value) {
      const isKeyArray = checkIfKeyIsArray(key);
      if (!key.length) return;
      if (!isKeyArray) {
        if (value.split(",").length > 1) value = value.split(",");
        paramsMap[key] = value;
      } else {
        key = key.slice(0, key.length - 2);

        if (
          typeof paramsMap[key] !== undefined &&
          Object.prototype.toString.call(paramsMap[key]) === "[object Array]"
        ) {
          paramsMap[key].push(value);
        } else {
          paramsMap[key] = [value];
        }
      }
    }

    if (l.length > 0 || h.length > 0) {
      const hashIndex = h.indexOf("?");
      const hashPartials = hashIndex > -1 ? h.slice(hashIndex + 1) : "";
      if (hashPartials.length > 0) l += "&" + hashPartials;

      const partials = l.slice(1).split("&");

      partialsLoop: for (let j = 0; j < partials.length; j++) {
        const p = partials[j].split("=");
        let key = decodeURI(p[0]);
        if (params && params.length) {
          for (let i = 0; i < params.length; i++) {
            if (paramsMap[params[i]] && !checkIfKeyIsArray(key)) continue;
            let _key = key;
            if (checkIfKeyIsArray(key)) _key = key.slice(0, key.length - 2);
            if (_key === params[i]) {
              paramsMapAssign(key, decodeURI(p[1]));

              continue partialsLoop;
            }
          }
        } else paramsMapAssign(key, decodeURI(p[1]));
      }
    }
    return paramsMap;
  }

  function getParams(params) {
    if (typeof params === "string") {
      let _params = params;

      if (checkIfKeyIsArray(params))
        _params = params.slice(0, params.length - 2);
      return parseUrl([params])[_params] || false;
    }

    if (Object.prototype.toString.call(params) === "[object Array]")
      return parseUrl(params);

    return parseUrl();
  }

  function setParams(key, value = false, isHash = false) {
    let l = window.location.search;
    let h = window.location.hash;
    let partials = l.slice(1).split("&");
    const hashIndex = h.indexOf("?");
    if ((isHash || (value && !isHash)) && hashIndex > -1)
      partials = (hashIndex > -1 ? h.slice(hashIndex + 1) : "").split("&");
    if (partials[0] === "") partials.shift();
    function insertParam(key, value, isHash = false) {
      key = encodeURI(key);
      value =
        Object.prototype.toString.call(value) === "[object Array]"
          ? value
          : encodeURI(value);

      let exists = false;
      for (let i = 0; i < partials.length; i++) {
        const p = partials[i].split("=");
        let param = decodeURI(p[0]);
        const isParamArray = checkIfKeyIsArray(param);

        if (isParamArray) param = param.slice(0, param.length - 2);
        if (key === param) {
          p[1] = value;
          partials[isParamArray ? partials.length : i] = p.join("=");
          exists = true;
          break;
        }
      }
      if (Object.prototype.toString.call(value) === "[object Array]") {
        for (let i = 0; i < value.length; i++) {
          partials.push([key + "%5B%5D", encodeURI(value[i])].join("="));
        }
      }
      if (!exists) partials.push([key, value].join("="));
    }

    if (typeof key === "string") insertParam(key, value);

    if (Object.prototype.toString.call(key) === "[object Object]") {
      for (let i = 0; i < Object.keys(key).length; i++) {
        insertParam(Object.keys(key)[i], key[Object.keys(key)[i]], value);
        if (value) isHash = true;
      }
    }

    const partialsString = partials.join("&");
    if (isHash) {
      const _r = partialsString > window.location.hash;
      window.location.hash = "?" + partialsString;
      return _r;
    } else window.location.search = partialsString;
    return true;
  }

  function hasParams(params) {
    // @ Todo
  }

  function removeParams() {
    // @ Todo
  }

  function clearParams() {
    // @ Todo
  }

  return {
    get: getParams,
    set: setParams
  };
})(window);
