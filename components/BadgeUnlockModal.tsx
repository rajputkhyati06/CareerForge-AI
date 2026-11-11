'use client';

import React from 'react';
import { SkillBadge } from '@/lib/badges-system';
import { SkillCompletionModal } from '@/components/SkillCompletionModal';

interface BadgeUnlockModalProps {
  badge: SkillBadge;
  onClose: () => void;
}

export const BadgeUnlockModal: React.FC<BadgeUnlockModalProps> = ({ badge, onClose }) => {
  return <SkillCompletionModal badge={badge} onClose={onClose} />;
};
