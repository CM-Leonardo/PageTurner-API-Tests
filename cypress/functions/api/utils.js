import { rotas } from "../utils/envVariaveis"

export function converteRotas(rota, id, placeholder = '{id}') {
    if (!id || !id.toString().trim()) {
        return rota.includes(`${placeholder}/`)
            ? rota.replace(`${placeholder}/`, '')
            : rota.replace(`/${placeholder}`, '')
    }
    return rota.replace(placeholder, id)
}

export const expectSuccessfullyListEmpyt = (response) => {

    expect(response.status).to.eq(200)
    expect(response.body.content).to.be.an('array').that.is.empty
}

export const expectUnauthorized = (response) => {

    expect(response.status).to.eq(401, 'Unauthorized')
    expect(response.body).to.be.empty
}

export const expectInternalServerError = (response, errorMessage) => {

    expect(response.status).to.eq(500, 'Internal Server Error')
    expect(response.body).to.not.be.empty
    expect(response.body.success).to.eq(false)
    expect(response.body.error).to.eq(errorMessage)
}

export const expectBadRequest = (response, errorMessage) => {

    expect(response.status).to.eq(400, 'Bad Request')
    expect(response.body).to.not.be.empty
    expect(response.body.success).to.eq(false)
    expect(response.body.error).to.eq(errorMessage)
}

export const expectForbidden = (response, errorMessage) => {

    expect(response.status).to.eq(403, 'Forbidden')
    expect(response.body).to.not.be.empty
    expect(response.body.success).to.eq(false)
    expect(response.body.error).to.eq(errorMessage)
}