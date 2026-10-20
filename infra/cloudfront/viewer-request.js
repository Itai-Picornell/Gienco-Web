/**
 * CloudFront Function (viewer-request) — giencoband.com
 *
 * Distribución E1EL5105A0D5C. NO se despliega con GitHub Actions: se crea y
 * publica a mano (consola de CloudFront) y se asocia al comportamiento por
 * defecto como "Viewer request". Runtime: cloudfront-js-2.0.
 *
 * Una única URL por página, la misma que declaran canonical y sitemap:
 *   www.giencoband.com/<ruta>  → 301 https://giencoband.com/<ruta>
 *   /index.html                → 301 /
 *   /about/, /about/index.html → 301 /about
 * (la query string se conserva, p. ej. ?utm_source=...)
 *
 * Reescritura interna: /about → /about/index.html, el HTML que genera el
 * build para cada ruta con su propio <head>. Una ruta sin fichero devuelve
 * 403 en S3 y CloudFront sirve la página de error configurada.
 */
var CANONICAL_HOST = 'giencoband.com';

function handler(event) {
    var request = event.request;
    var uri = request.uri;
    var host = request.headers.host ? request.headers.host.value : CANONICAL_HOST;

    var target = uri.replace(/\/index\.html$/, '/');
    if (target.length > 1) {
        target = target.replace(/\/+$/, '');
    }
    if (target === '') {
        target = '/';
    }

    if (host !== CANONICAL_HOST || target !== uri) {
        return redirect('https://' + CANONICAL_HOST + target + queryString(request.querystring));
    }

    if (uri === '/') {
        request.uri = '/index.html';
    } else if (uri.indexOf('.') === -1) {
        request.uri = uri + '/index.html';
    }
    return request;
}

function queryString(querystring) {
    var parts = [];
    for (var key in querystring) {
        var entry = querystring[key];
        var values = entry.multiValue ? entry.multiValue : [entry];
        for (var i = 0; i < values.length; i++) {
            parts.push(values[i].value === '' ? key : key + '=' + values[i].value);
        }
    }
    return parts.length ? '?' + parts.join('&') : '';
}

function redirect(location) {
    return {
        statusCode: 301,
        statusDescription: 'Moved Permanently',
        headers: {
            location: { value: location },
            'cache-control': { value: 'public, max-age=3600' },
        },
    };
}
