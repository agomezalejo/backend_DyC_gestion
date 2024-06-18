function minimizeDebts(balances) {
    let transactions = [];
    
    while (true) {
      let maxCredit = balances.reduce((max, curr) => (curr.balance > max.balance ? curr : max), { balance: -Infinity });
      let maxDebt = balances.reduce((min, curr) => (curr.balance < min.balance ? curr : min), { balance: Infinity });
  
      if (Math.abs(maxCredit.balance) < 0.01 && Math.abs(maxDebt.balance) < 0.01) break;
  
      let minAmount = Math.min(maxCredit.balance, -maxDebt.balance);
  
      maxCredit.balance -= minAmount;
      maxDebt.balance += minAmount;
  
      transactions.push({
        from: maxDebt.id_usuario,
        to: maxCredit.id_usuario,
        amount: minAmount
      });
    }
  
    return transactions;
  }


module.exports = {
    minimizeDebts
}