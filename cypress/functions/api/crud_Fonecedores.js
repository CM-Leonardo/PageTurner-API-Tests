import { url, rotas, user } from "../utils/envVariaveis";
import { converteRotaIntegracao, converteRotas } from "./utils";
import { authentication } from "./auth";

export function getEditora(cnpjEditora, acessToken) {
    return cy.request({
        method: 'GET',
        url: `${url.api_base}${rotas.get_Editora}${cnpjEditora}`,
        headers: { Platform: 'pageturner', Authorization: `Bearer ${acessToken}` },
        failOnStatusCode: false
    })
}

export function getEditoraIntegration(idEditora, acessToken) {
    const rota = rotas.get_EditoraIntegration
    const rota_EditoraIntegracao = converteRotas(rota, idEditora)

    return cy.request({
        method: 'GET',
        url: `${url.api_base}${rota_EditoraIntegracao}`,
        headers: { Platform: 'pageturner', Authorization: `Bearer ${acessToken}` },
        failOnStatusCode: false
    })
}

export function patchEditora(idEditora, acessToken, payload) {
    const rota = rotas.patch_Editora
    const rota_patchEditora = converteRotas(rota, idEditora)

    return cy.request({
        method: 'PATCH',
        url: `${url.api_base}${rota_patchEditora}`,
        headers: { Platform: 'pageturner', Authorization: `Bearer ${acessToken}` },
        body: payload,
        failOnStatusCode: false
    })
}