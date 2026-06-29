import { url, user, rotas } from "../utils/envVariaveis";

export function authentication(isAdm = false) {
    const credentials = isAdm 
    ? {
        email: user.email_adm,
        password: user.password_adm
    }
    : {
        email: user.email,
        password: user.password
    }

    return cy.request({
        method: 'POST',
        url: `${url.api_base}${rotas.login}`,
        body: credentials
    
    })
}