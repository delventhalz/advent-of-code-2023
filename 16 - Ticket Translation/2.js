// --- Part Two ---

// Now that you've identified which tickets contain invalid values, discard
// those tickets entirely. Use the remaining valid tickets to determine which
// field is which.

// Using the valid ranges for each field, determine what order the fields
// appear on the tickets. The order is consistent between all tickets: if seat
// is the third field, it is the third field on every ticket, including your
// ticket.

// For example, suppose you have the following notes:

//     class: 0-1 or 4-19
//     row: 0-5 or 8-19
//     seat: 0-13 or 16-19

//     your ticket:
//     11,12,13

//     nearby tickets:
//     3,9,18
//     15,1,5
//     5,14,9

// Based on the nearby tickets in the above example, the first position must be
// row, the second position must be class, and the third position must be seat;
// you can conclude that in your ticket, class is 12, row is 11, and seat is
// 13.

// Once you work out which field is which, look for the six fields on your
// ticket that start with the word departure. What do you get if you multiply
// those six values together?

const toPredicate = (rangeString) => {
  const [min, max] = rangeString.split('-').map(Number);
  return num => num >= min && num <= max;
};

const or = predicates => val => predicates.some(pred => pred(val));

const parseRule = ([line]) => {
  const [key, ruleString] = line.split(': ');
  return [key, or(ruleString.split(' or ').map(toPredicate))];
};


module.exports = (inputs) => {
  const rules = inputs[0].map(parseRule);
  const _myTicket = inputs[1][1];
  const nearbyTickets = inputs[2]
    .slice(1)
    .filter(ticket => !ticket.find(
      num => !rules.some(([_, rule]) => rule(num))
    ));

  const spots = {};

  for (let spot = 0; spot < rules.length; spot += 1) {
    const tickets = nearbyTickets.map(ticket => ticket[spot]);

    for (const [key, rule] of rules) {
      if (tickets.every(ticket => rule(ticket))) {
        if (spots[key]) {
          spots[key].push(spot);
        } else {
          spots[key] = [spot];
        }
      }
    }
  }

  // Ended up manually working out the solution based on this data...
  return spots;
};

// Your puzzle answer was 279139880759.
