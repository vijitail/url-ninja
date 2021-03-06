![logo](https://imgur.com/UVHxfAhl.png)

# URL Ninja

A minimal cross browser URL query string parser library.

## Installation

Add the `url-ninja.js` file inside your project and include it using a `<script>` tag

```html
<script src="url-ninja.min.js"></script>
```

## Usage

### `_url.get()`

To get all query parameters use the `_url.get()` method. This will return an object of query parameters key-value pairs.

```js
const queryParams = _url.get();
```

To get a specific query, pass the parameter name.

```js
const categoryId = _url.get("category_id");
```

You can also pass an array of parameters inside the `get` method.

```js
const catInfo = _url.get(["category_id", "collection_id"]);

/*  will return

    {
        category_id: 321
        collection_id: 12
    }
*/
```

You can also parse paramters as array.

For example, `cars%5B%5D=Volvo&cars%5B%5D=Saab&cars%5B%5D=Mercedes` this query string can be parsed to an array.

```js
const cars = _url.get("cars"); // [Volvo, Saab, Mercedes]
```

`cars=Volvo,Saab,Mercedes` will also parse in to an array.

Use the `getHash()` method, if you want to get paramaters from location hash.

**Note** that location hash string must have a "?" before the start of parameters, just like in regular query strings.

### `_url.set()`

You can set new query parameters by using the `set()` method.

```js
_url.set("language", "PHP");
```

To set a hash query parameter, use the `setHash()` method.

```js
_url.setHash("language", "PHP");
```

You can also set multiple parameters

```js
_url.set({
  language: "PHP",
  frameworks: ["Laravel", "Symfony", "Codeigniter"]
});

// for hash parameters
const params = {
  language: "PHP",
  frameworks: ["Laravel", "Symfony", "Codeigniter"]
};
_url.setHash(params);
```

**Note** that, `set` will reload the page if the hash boolean is not passed. So if you are building an ajax based filters, use the hash parameters. On the other hand, hash parameters are not sent to the server. In that case, you will have to set the query parameters. I would suggest, either using hash or normal query parameters, but not both together.

### `_url.has()`

The `_url.has()` method will return boolean, based on if the paramter exists in the URL. If an array is paased to this method, it will return an object.

```js
const hasLocation = _url.has("location"); // true or false

const checkParams = _url.has(["name", "location"]); // { name: false, location: true }
```

Use the `hasHash()` method to check parameters in location hash string.

### `_url.remove()`

The `_url.remove()` method will remove the specified param from the URL.

```js
_url.remove("location");

_url.remove(["location", "cars"]);
```

Use the `removeHash()` to remove from param from location hash string.

```js
_url.removeHash("location");

_url.removeHash(["location", "cars"]);
```

If you have array based parameters, you can also remove a param with specific value.

For example, `cars%5B%5D=Volvo&cars%5B%5D=Saab&cars%5B%5D=Mercedes` for this query string if you want to remove the value "Saab".

```js
_url.remove("cars", "Saab");

_url.removeHash("cars", "Saab"); // for hash parameter
```

### `_url.clear()`

The `clear` method will remove all query parameters from the URL.

```js
_url.clear(); // will remove from location.search

_url.clearHash(); // will remove from location.hash
```

## Motivation

I work on E-commerce applications regularly. Often it includes fixing filters or adding new filters in the shop page. So, instead of reimplementing the core features, again and again, I decided to create this helper library to assist me in getting a headstart.
