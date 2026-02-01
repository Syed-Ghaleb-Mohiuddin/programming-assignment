import { ReactNode } from 'react';

export interface FeatureCardProps {
  title: string;
  description: string;
  icon?: ReactNode;
}

export interface StepProps {
  number: string;
  title: string;
  description: string;
  icon: ReactNode;
}

export interface ModeCardProps {
  title: string;
  description: string;
  icon: ReactNode;
  isActive?: boolean;
}