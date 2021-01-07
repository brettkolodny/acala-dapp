import { CouncilType, ModuleProposalCouncilConfig, proposalsConfig } from '../../config';
import React, { createContext, FC, PropsWithChildren, useCallback, useEffect, useMemo, useReducer } from 'react';
import { useApi } from '@acala-dapp/react-hooks';

type CreateProposalState = 'select_module'
| 'check_authority'
| 'select_proposal'
| 'enter_params'
| 'submit_success'
| 'submit_failed'

type CreateAction = { type: 'update_selected_council'; data: CouncilType | null }
| { type: 'update_selected_module'; data: string }
| { type: 'set_current_proposal_config'; data: ModuleProposalCouncilConfig[] }
| { type: 'update_state'; data: CreateProposalState }

type CreateState = {
  state: CreateProposalState | null;
  selectedModule: string | null;
  selectedProposal: string | null;
  currentProposalConfig: ModuleProposalCouncilConfig[];
}

const initState: CreateState = {
  currentProposalConfig: [],
  selectedModule: null,
  selectedProposal: null,
  state: 'select_module'
};

function getProposalsConfig (chainName: string): ModuleProposalCouncilConfig[] {
  const _chainName = chainName.toLocaleLowerCase();

  const isAcala = _chainName.includes('acala');
  const isMandala = _chainName.includes('mandala');
  const isKarura = _chainName.includes('karura');

  if (isAcala) return proposalsConfig.acala;

  if (isMandala) return proposalsConfig.mandala;

  if (isKarura) return proposalsConfig.karura;

  return proposalsConfig.mandala;
}

const reducer = (state: CreateState, action: CreateAction): CreateState => {
  switch (action.type) {
    case 'update_selected_module': {
      return {
        ...state,
        selectedModule: action.data
      };
    }

    case 'set_current_proposal_config': {
      return {
        ...state,
        currentProposalConfig: action.data
      };
    }
  }

  return state;
};

export const CreateContext = createContext<
CreateState & {
  onSelectModule(module: string): void;
}
>({} as any);

export const CreateProvider: FC<PropsWithChildren<any>> = ({ children }) => {
  const { chainInfo } = useApi();
  const [state, dispatch] = useReducer(reducer, initState);

  const next = useCallback(() => {

  }, []);

  const pre = useCallback(() => {

  }, []);

  const onSelectModule = useCallback((data: string) => {
    dispatch({
      data,
      type: 'update_selected_module'
    });
  }, []);

  const context = useMemo(() => ({
    ...state,
    onSelectModule
  }), [next, pre, state, onSelectModule]);

  useEffect(() => {
    if (chainInfo.chainName) {
      const config = getProposalsConfig(chainInfo.chainName);

      dispatch({
        data: config,
        type: 'set_current_proposal_config'
      });
    }
  }, [chainInfo]);

  return (
    <CreateContext.Provider value={context}>
      {children}
    </CreateContext.Provider>
  );
};
