import { ModuleCalls, ModuleProposalCouncilConfig, proposalsConfig } from '../../config';
import React, { createContext, FC, PropsWithChildren, useCallback, useEffect, useMemo, useReducer } from 'react';
import { useApi } from '@acala-dapp/react-hooks';

export interface ProposalData extends ModuleCalls {
  collective: string;
}

type CreateProposalState = 'select_module'
| 'check_authority'
| 'select_proposal'
| 'enter_params'
| 'submit_success'
| 'submit_failed'

type CreateAction = { type: 'set_current_proposal_config'; data: ModuleProposalCouncilConfig[] }
| { type: 'set_allowed_proposals'; data: ProposalData[] }
| { type: 'update_selected_proposal'; data: ProposalData }
| { type: 'update_state'; data: CreateProposalState }

type CreateState = {
  allowedProposals: ProposalData[];
  state: CreateProposalState | null;
  selectedProposal: ProposalData | null;
  currentProposalConfig: ModuleProposalCouncilConfig[];
}

const initState: CreateState = {
  allowedProposals: [],
  currentProposalConfig: [],
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
    case 'update_selected_proposal': {
      return {
        ...state,
        selectedProposal: action.data
      };
    }

    case 'set_current_proposal_config': {
      return {
        ...state,
        currentProposalConfig: action.data
      };
    }

    case 'set_allowed_proposals': {
      return {
        ...state,
        allowedProposals: action.data
      };
    }
  }

  return state;
};

export const CreateContext = createContext<
CreateState & {
  onSelectProposal(data: ProposalData): void;
  setProposalDatas(data: ProposalData[]): void;
}
>({} as any);

export const CreateProvider: FC<PropsWithChildren<any>> = ({ children }) => {
  const { chainInfo } = useApi();
  const [state, dispatch] = useReducer(reducer, initState);

  const onSelectProposal = useCallback((data: ProposalData) => {
    dispatch({
      data,
      type: 'update_selected_proposal'
    });
  }, []);

  const setProposalDatas = useCallback((data: ProposalData[]) => {
    dispatch({
      data,
      type: 'set_allowed_proposals'
    });
  }, [dispatch]);

  const contextData = useMemo(() => ({
    ...state,
    onSelectProposal,
    setProposalDatas
  }), [state, setProposalDatas, onSelectProposal]);

  useEffect(() => {
    if (chainInfo.chainName) {
      dispatch({
        data: getProposalsConfig(chainInfo.chainName),
        type: 'set_current_proposal_config'
      });
    }
  }, [chainInfo]);

  return (
    <CreateContext.Provider value={contextData}>
      {children}
    </CreateContext.Provider>
  );
};
