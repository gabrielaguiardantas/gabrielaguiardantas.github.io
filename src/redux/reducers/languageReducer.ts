type ActionType = {
    type: string;
    payload: string;
  };
  
  const SUPPORTED_LANGUAGES = ["english", "portuguese"];
  
  const INITIAL_STATE = {
    language: SUPPORTED_LANGUAGES[1],
  };
  
  function languageReducer(state = INITIAL_STATE, action: ActionType) {
    switch (action.type) {
      case 'SWITCH_LANGUAGE':
        switch (action.payload) {
          case SUPPORTED_LANGUAGES[0]:
            return { ...state, language: SUPPORTED_LANGUAGES[0] };
          case SUPPORTED_LANGUAGES[1]:
            return { ...state, language: SUPPORTED_LANGUAGES[1] };
          default:
            return state;
        }
      default:
        return state;
    }
  }
  
  export default languageReducer;
  