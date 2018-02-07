/**
 * 调查问卷
 */
const state = {
    // 问卷调查请求状态
    survey_get_questionnaire: true
}

const getters = {}

const mutations = {
    survey_get_questionnaire_save(state, payload) {
        state.survey_get_questionnaire = payload
    }
}

const actions = {}

export default {
    state,
    getters,
    mutations,
    actions
}
