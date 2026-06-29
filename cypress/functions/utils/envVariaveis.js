export const url = {
    api_base: Cypress.env("url")["api_base"]
}

export const user = {
    email: Cypress.env("usuario")["user_email"],
    password: Cypress.env("usuario")["user_password"],
    email_adm: Cypress.env("usuario")["user_adm"],
    password_adm: Cypress.env("usuario")["user_password_adm"],
    token_incorreto: Cypress.env("usuario")["token_incorreto"],
    token_expirado: Cypress.env("usuario")["token_expirado"],
    token_expirado_Adm: Cypress.env("usuario")["token_expirado_Adm"]
}

export const rotas = {
    login: 'login',
    get_EditoraIntegration: 'admin/editoras/{id}/integracao',
    get_Editora: 'editoras?page=0&size=10&query=',
    patch_Editora: 'admin/editoras/{id}'
}

export const editoras = {
    cnpj_GetEditora: "51691618000186",
    cnpj_GetEditoraInexistente: "08502954000104",
    cnpj_IncorretosGetEditora: [
        "12ABCD34000195",
        "ABCDEFGHIJKLMN",
        "12.345.678/0001-##",
        "!@#$%¨&*()_+{}",
    ],
    id_GetEditora: 1905,
    id_PatchEditora: 1904,
}

export const MESSAGES = {
    BAD_REQUEST: {
        TIPO_INCOMPATIVEL: 'Tipo de argumento incompatível',
        FORMATO_INCORRETO: 'Requisição no formato incorreto'
    },
    FORBIDDEN: {
        NAO_AUTORIZADO: 'Você não está autorizado a acessar esse recurso'
    },
    INTERNAR_SERVER_ERROR: {
        TENTE_MAIS_TARDE: 'Algo deu errado, tente novamente mais tarde'
    }
}