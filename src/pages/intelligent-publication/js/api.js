/** 刊登规则 */
// 规则列表
export function listApi(params) {
  return usePost('/platform-ozon/intelligent/publishRule/page', params)
}

// 创建规则
export function createPublishRuleApi(params) {
  return usePost('/platform-ozon/intelligent/publishRule/createPublishRule', params)
}

// 更新规则
export function updatePublishRuleApi(params) {
  return usePost('/platform-ozon/intelligent/publishRule/updatePublishRule', params)
}

// 规则详情
export function ruleDetailApi(id) {
  return useGet(`/platform-ozon/intelligent/publishRule/getRuleDetail/${id}`)
}

// 规则备注
export function updateRuleRemarkApi(params) {
  return usePost('/platform-ozon/intelligent/publishRule/updateRuleRemark', params)
}

// 规则状态
export function updateRuleStatusApi(params) {
  return usePost('/platform-ozon/intelligent/publishRule/updateRuleStatus', params)
}
