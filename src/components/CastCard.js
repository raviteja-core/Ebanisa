import React from 'react';
import { getCastImageUrl } from '../utils/images';

function CastCard({ member }) {
  const imageUrl = getCastImageUrl(member);

  return (
    <li className="cast-card">
      <img src={imageUrl} alt={member.name} />
      <p>{member.name}</p>
      <span>{member.character || 'Unknown Role'}</span>
    </li>
  );
}

export default CastCard;
