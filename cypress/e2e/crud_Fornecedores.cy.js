import { getEditora, getEditoraIntegration, patchEditora } from "../functions/api/crud_Editoras"
import { authentication } from "../functions/api/auth"
import { user, editoras, messages, MESSAGES } from "../functions/utils/envVariaveis"
import { expectBadRequest, expectForbidden, expectInternalServerError, expectSuccessfullyListEmpyt, expectUnauthorized } from "../functions/api/utils"

const simulandoConflito = false

describe('CRUD Editoras - API', () => {
    let acessTokenAdm
    let acessToken
    let payload
    const tokens =
        Object.entries({
            token_Adm_expirado: user.token_expirado_Adm,
            token_Padrao_expirado: user.token_expirado

        })

    before(() => {
        cy.fixture('payloads/editoras.payload.json')
            .then((data) => {
                payload = data
            })

        authentication(true)
            .then((resp) => {
                acessTokenAdm = resp.body.jwtToken

                authentication({ log: false })
                    .then((resp) => {
                        acessToken = resp.body.jwtToken
                    })

                patchEditora(editoras.id_PatchEditora, acessTokenAdm, payload.ESTADO_ORIGINAL)
            })
    })

    after(() => {
        patchEditora(editoras.id_PatchEditora, acessTokenAdm, payload.ESTADO_ORIGINAL)
    })

    describe('Valida o método GET /editoras/integracoes-por-cnpj', () => {
        context('Validando requisições com resposta 200', () => {

            it('Deve retornar 200 ao fazer a requisição com dados validos', () => {
                getEditora(editoras.cnpj_GetEditora, acessToken)
                    .then((response) => {
                        const {
                            id,
                            cnpj,
                            razaoSocial,
                            nomeFantasia,
                            uf
                        } = response.body.content[0]

                        expect(response.status).to.eq(200)
                        expect(response.body).to.not.be.empty
                        expect(id).to.equal(1905)
                        expect(cnpj).to.equal('51691618000186')
                        expect(razaoSocial).to.equal('Editora')
                        expect(nomeFantasia).to.equal('(GET Test)')
                        expect(uf).to.equal('SP')
                    })
            })

            it('Deve retornar 200 e lista "[]" ao fazer uma requisção com editora inexistente', () => {
                getEditora(editoras.cnpj_GetEditoraInexistente, acessToken)
                    .then((response) => expectSuccessfullyListEmpyt(response))
            })

            it('Deve retornar 200 e lista "[]" ao fazer uma requisição com diversos tipo de CNPJS invalidos', () => {
                editoras.cnpj_IncorretosGetEditora.forEach((cnpjs) => {
                    cy.log(`Validando com o CNPJ: ${cnpjs}`)

                    getEditora(cnpjs, acessToken)
                        .then((response) => expectSuccessfullyListEmpyt(response))
                })
            })
        })

        context('Validando requisições com respostas 401', () => {
            it('Deve retornar 401 ao fazer uma requisição sem estar autenticado', () => {
                getEditora(editoras.cnpj_GetEditora, '')
                    .then((response) => expectUnauthorized(response))
            })

            it('Deve retonar 401 ao fazer uma requisição com token invalido', () => {
                getEditora(editoras.cnpj_GetEditora, user.token_incorreto)
                    .then((response) => expectUnauthorized(response))
            })

            it('Deve retornar 401 ao fazer uma requisição com token expirado', () => {
                tokens.forEach(([nome, token]) => {
                    cy.log(`Testando requisição com ${nome}`)

                    getEditora(editoras.cnpj_GetEditora, token)
                        .then((response) => expectUnauthorized(response))
                })
            })
        })
    })

    describe('Valida o método GET /admin/editoras/{id}/integracao', () => {
        context('Validando requisições com resposta 200', () => {

            it('Deve retornar 200 ao fazer a requisição com dados validos', () => {
                getEditoraIntegration(editoras.id_GetEditora, acessTokenAdm)
                    .then((response) => {
                        const {
                            integrationId,
                            integrationName,
                            accessUrl,
                            accessCode,
                            minimumBillingPrice
                        } = response.body[0]

                        expect(response.status).to.eq(200)
                        expect(response.body).to.not.be.empty
                        expect(integrationId).to.eq(1616)
                        expect(integrationName).to.equal('Teste API ')
                        expect(accessUrl).to.equal('teste.com')
                        expect(accessCode).to.equal('123321')
                        expect(minimumBillingPrice).to.equal('COM_ST')
                    })
            })
        })

        context('Validando requisições com respostas 500, 400, 403 e 401', () => {

            it('Deve retornar 500 ao fazer uma requisição com Id Editora inexistente', () => {
                getEditoraIntegration(123445, acessTokenAdm)
                    .then((response) => expectInternalServerError(response, MESSAGES.INTERNAR_SERVER_ERROR.TENTE_MAIS_TARDE))
            })

            it('Deve retornar 400 ao fazer uma requisição com Id Editora em forma de String', () => {
                getEditoraIntegration('abc', acessTokenAdm)
                    .then((response) => expectBadRequest(response, MESSAGES.BAD_REQUEST.TIPO_INCOMPATIVEL))   
            })

            it('Deve retornar 400 ao fazer uma requisição com Id Editora vazio', () => {
                getEditoraIntegration(null, acessTokenAdm)
                    .then((response) => expectBadRequest(response, MESSAGES.BAD_REQUEST.FORMATO_INCORRETO))
     
            })

            // SKIP nesse teste pois a API nao esta mais bloqueando requisições com usuários padrões (Vou criar um card para correção)
            it('Deve retornar 403 ao fazer uma requisição com token de acesso de usuário padrão ', () => {
                getEditoraIntegration(1905, acessToken)
                    .then((response) => expectForbidden(response, MESSAGES.FORBIDDEN.NAO_AUTORIZADO))
            })

            it('Deve retornar 401 ao fazer uma requisição com token expirado', () => {
                tokens.forEach(([nome, token]) => {
                    cy.log(`Testando requisição com ${nome}`)

                    getEditoraIntegration(editoras.id_GetEditora, token)
                        .then((response) => expectUnauthorized(response))
                })
            })
        })
    })

    describe('Valida o método PATCH /admin/editoras/{id}', () => { 
        context('Validando requisições com resposta 200', () => {

            it('Deve retornar 200 ao fazer uma requisição com dados validos', () => {

                patchEditora(editoras.id_PatchEditora, acessTokenAdm, payload.PAYLOAD_EDICACAO)
                    .then((responsePatchEditora) => {

                        // Valida o retorno do PATCH
                        expect(responsePatchEditora.status).to.eq(200)
                        expect(responsePatchEditora.body).to.be.not.empty
                        expect(responsePatchEditora.body.name).to.eq(payload.PAYLOAD_EDICACAO.tradeName)
                        expect(responsePatchEditora.body.uf).to.eq(payload.PAYLOAD_EDICACAO.uf)

                        return getEditora(responsePatchEditora.body.cnpj, acessToken)
                    })
                    .then((responseEditora) => {

                        // Valida e confirma a persistencia do PATCH via GET
                        expect(responseEditora.body.content[0].razaoSocial).to.not.equal(payload.ESTADO_ORIGINAL.companyName)
                        expect(responseEditora.body.content[0].nomeFantasia).to.not.equal(payload.ESTADO_ORIGINAL.tradeName)
                        expect(responseEditora.body.content[0].uf).to.not.equal(payload.ESTADO_ORIGINAL.uf)
                    })
            })
        })

        context('Validando requisições com dados enviados incorretos', () => {

            it('Deve retornar 500 ao fazer uma requisição com Id Editora inexistente', () => {
                patchEditora(123445, acessTokenAdm, payload.PAYLOAD_EDICACAO)
                    .then((response) => expectInternalServerError(response, MESSAGES.INTERNAR_SERVER_ERROR.TENTE_MAIS_TARDE))

            })

            it('Deve retornar 400 ao fazer uma requisição com Id Editora em forma de String', () => {
                patchEditora('abc', acessTokenAdm, payload.PAYLOAD_EDICACAO)
                    .then((response) => expectBadRequest(response, MESSAGES.BAD_REQUEST.TIPO_INCOMPATIVEL))
            })

            it('Deve retornar 400 ao fazer uma requisição com Id Editora vazio', () => {
                patchEditora(null, acessTokenAdm, payload.PAYLOAD_EDICACAO)
                    .then((response) => expectBadRequest(response, MESSAGES.BAD_REQUEST.FORMATO_INCORRETO))
            })

            it('Deve retornar 403 ao fazer uma requisição com token de acesso de usuário padrão', () => {
                patchEditora(1904, acessToken, payload.PAYLOAD_EDICACAO)
                    .then((response) => expectForbidden(response, MESSAGES.FORBIDDEN.NAO_AUTORIZADO))
            })
        })
    })
})