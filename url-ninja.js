window._url = (function(window) {
  function checkIfKeyIsArray(key) {
    return key.slice("-2") === "[]";
  }

  function getHashString() {
    const h = window.location.hash;
    const hashIndex = h.indexOf("?");
    const hash = hashIndex > -1 ? h.slice(hashIndex) : "";
    return hash;
  }

  function parseUrl(params, l) {
    const paramsMap = {};

    function paramsMapAssign(key, value) {
      const isKeyArray = checkIfKeyIsArray(key);
      if (!key.length) return;
      if (!isKeyArray) {
        if (value.split(",").length > 1) value = value.split(",");
        paramsMap[key] = value;
      } else {
        key = key.slice(0, key.length - 2); // toggle

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

    if (l.length > 0) {
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

  function _getParams(params, l) {
    if (typeof params === "string") {
      let _params = params;

      if (checkIfKeyIsArray(params))
        _params = params.slice(0, params.length - 2);
      return parseUrl([params], l)[_params] || false;
    }

    if (Object.prototype.toString.call(params) === "[object Array]")
      return parseUrl(params, l);

    return parseUrl(undefined, l);
  }

  function getParams(params) {
    return _getParams(params, window.location.search);
  }

  function getHashParams(params) {
    const hash = getHashString();
    return _getParams(params, hash);
  }

  function _setParams(key, value, l) {
    let partials = l.slice(1).split("&");
    if (partials[0] === "") partials.shift();
    function insertParam(key, value) {
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
      }
    }

    const partialsString = partials.join("&");
    return partialsString;
  }

  function setParams(key, value = false) {
    const partialsString = _setParams(key, value, window.location.search);
    window.location.search = partialsString;
    return true;
  }

  function setHashParams(key, value = false) {
    const hash = getHashString();
    const partialsString = _setParams(key, value, hash);
    window.location.hash = "?" + partialsString;
    return true;
  }

  function hasParams(params) {
    if (typeof params === "string") return !!getParams(params);

    if (Object.prototype.toString.call(params) === "[object Array]") {
      const map = {};
      for (let i = 0; i < params.length; i++) {
        map[params[i]] = !!getParams(params[i]);
      }
      return map;
    }

    return false;
  }

  function hasHashParams(params) {
    if (typeof params === "string") return !!getHashParams(params);

    if (Object.prototype.toString.call(params) === "[object Array]") {
      const map = {};
      for (let i = 0; i < params.length; i++) {
        map[params[i]] = !!getHashParams(params[i]);
      }
      return map;
    }

    return false;
  }

  function _removeParams(params, value, l) {
    let partials = l.slice(1).split("&");

    function deleteParam(key, value) {
      for (let i = 0; i < partials.length; i++) {
        const p = partials[i].split("=");
        const _pA = checkIfKeyIsArray(decodeURI(p[0]));
        _key = _pA ? key + "[]" : key;
        if (decodeURI(p[0]) === _key) {
          if (_pA) {
            if (value === decodeURI(p[1])) {
              partials.splice(i, 1);
              break;
            } else if (value !== decodeURI(p[1]) && typeof value !== "boolean")
              continue;
            partials[i] = "";
            continue;
          } else {
            partials.splice(i, 1);
            break;
          }
        }
      }
    }

    if (typeof params === "string") deleteParam(params, value);

    if (Object.prototype.toString.call(params) === "[object Array]") {
      for (let i = 0; i < params.length; i++) {
        deleteParam(params[i], value);
      }
    }

    const partialsString = partials.join("&");
    return partialsString;
  }

  function removeParams(params, value) {
    let partialsString = _removeParams(params, value, window.location.search);
    window.location.search = partialsString;
    return true;
  }

  function removeHashParams(params, value) {
    const hash = getHashString();
    let partialsString = _removeParams(params, value, hash);
    window.location.hash = "?" + partialsString;
    return true;
  }

  function clearParams() {
    window.location.search = "";
  }

  function clearHashParams() {
    window.location.hash = "";
  }

  return {
    get: getParams,
    getHash: getHashParams,
    set: setParams,
    setHash: setHashParams,
    has: hasParams,
    hasHash: hasHashParams,
    remove: removeParams,
    removeHash: removeHashParams,
    clear: clearParams,
    clearHash: clearHashParams
  };
})(window);
