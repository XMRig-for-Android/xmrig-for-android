import React from 'react';
import { EditSimpleForkCard, EditSimpleCardProps } from '../edit-simple/index';

// eslint-disable-next-line react/jsx-props-no-spreading
const EditAdvanceForkCard: React.FC<EditSimpleCardProps> = (props) => <EditSimpleForkCard {...props} />;

export default EditAdvanceForkCard;
