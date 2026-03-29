import Array "mo:core/Array";
import Text "mo:core/Text";
import Iter "mo:core/Iter";
import Order "mo:core/Order";
import Map "mo:core/Map";

actor {
  type ScoreEntry = {
    playerName : Text;
    score : Nat;
  };

  module ScoreEntry {
    // Default comparison function: Reverse order to get descending sort by default
    public func compare(score1 : ScoreEntry, score2 : ScoreEntry) : Order.Order {
      Nat.compare(score2.score, score1.score);
    };
  };

  let scores = Map.empty<Text, Nat>();

  public shared ({ caller }) func submitScore(playerName : Text, score : Nat) : async () {
    scores.add(playerName, score);
  };

  public query ({ caller }) func getTopScores() : async [ScoreEntry] {
    let scoreEntries = scores.entries().map(func((playerName, score)) { { playerName; score } }).toArray();
    scoreEntries.sort(); // Implicitly uses ScoreEntry.compare for descending sort
  };

  public shared ({ caller }) func clearScores() : async () {
    scores.clear();
  };
};
