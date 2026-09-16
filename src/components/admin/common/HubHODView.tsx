import React from 'react';
import { HubHODAgendaWorkspace } from './HubHODAgendaWorkspace';

interface HubHODViewProps {
  departmentName: string;
  departmentTitle?: string;
  departmentTagline?: string;
  defaultAgendas?: any[];
  defaultTieUps?: any[];
}

export const HubHODView: React.FC<HubHODViewProps> = ({
  departmentName,
  departmentTitle,
  departmentTagline,
  defaultAgendas,
  defaultTieUps
}) => {
  return (
    <HubHODAgendaWorkspace
      departmentName={departmentName}
      departmentTitle={departmentTitle}
      departmentTagline={departmentTagline}
      defaultAgendas={defaultAgendas}
      defaultTieUps={defaultTieUps}
    />
  );
};

export default HubHODView;
