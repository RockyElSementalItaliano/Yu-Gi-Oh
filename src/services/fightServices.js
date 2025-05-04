export const determineWinner = (player1, player2) => {
    let winner = null;
    let reason = '';
  
    if (player1.warrior.power === player2.warrior.power) {
      reason = 'Ambos guerreros tienen el mismo poder.';
    } else if (player1.warrior.power > player2.warrior.power) {
      winner = player1.name;
      reason = `${player1.warrior.name} supera a ${player2.warrior.name}.`;
    } else {
      winner = player2.name;
      reason = `${player2.warrior.name} supera a ${player1.warrior.name}.`;
    }
  
    return { winner, reason };
  }