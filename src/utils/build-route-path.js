// Test Regez
// /users/:id
// utilizado para tratar os parametros, isso é apenas para modo didatico, 
// mais para frete nos vamos utilizar ferramentas que já trata melhor esses parâmetros

export function buildRoutePath(path) {
    const routeParametersRegex = /:([a-zA-z]+)/g
    const pathWithParams = path.replaceAll(routeParametersRegex, '(?<$1>[a-z0-9\-_]+)')

    const pathRegex = new RegExp(`^${pathWithParams}(?<query>\\?(.*))?$`)

    //console.log(Array.from(path.matchAll(routeParametersRegex)))

    return pathRegex
}