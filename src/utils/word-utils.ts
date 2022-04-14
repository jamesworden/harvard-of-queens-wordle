import { Status } from './status';
import { DateUtils } from './date-utils';
import possibleGuesses from './possible-guesses.json';
import { env } from '../environments';
import { LetterComparison } from './letter-comparison';
import { LetterFrequencies } from './letter-frequencies';

const { possibleAnswers } = env;

export class WordUtils {
	// TODO: This function is massive and should be broken up.
	static getLetterComparisons(guess: string, answer: string): LetterComparison[] {
		const letterComparisons: LetterComparison[] = [];
		const elsewhereIndexes: number[] = [];
		const letterFrequencies = this.getLetterFrequencies(answer);

		// Check if letter is 'incorrect' or 'correct'
		for (let i = 0; i < answer.length; i++) {
			const guessLetter = guess.charAt(i);
			const answerLetter = answer.charAt(i);

			if (!answer.includes(guessLetter)) {
				// Letter is 'incorrect'
				letterComparisons.push({
					letter: guessLetter,
					status: Status.INCORRECT,
					tileIndex: i,
				});
			} else if (guessLetter === answerLetter) {
				// Letter is 'correct'
				letterComparisons.push({
					letter: guessLetter,
					status: Status.CORRECT,
					tileIndex: i,
				});
				// Let's say the answer has 3 X's in it and the guess has two X's in it.
				// This means we only want 1 X to be yellow. Remove a letter frequency
				// each time a letter is correct so we only add yellows where needed.
				letterFrequencies[guessLetter]--;
			} else {
				elsewhereIndexes.push(i);
			}
		}

		for (let i of elsewhereIndexes) {
			const guessLetter = guess.charAt(i);
			const letterFrequenciesRemain = letterFrequencies[guessLetter] > 0;

			if (letterFrequenciesRemain) {
				letterComparisons.push({
					letter: guessLetter,
					status: Status.ELSEWHERE,
					tileIndex: i,
				});

				letterFrequencies[guessLetter]--;
			} else {
				letterComparisons.push({
					letter: guessLetter,
					status: Status.INCORRECT,
					tileIndex: i,
				});
			}
		}

		return letterComparisons;
	}

	static getLetterFrequencies(word: string) {
		const letterFrequencies: LetterFrequencies = {};

		for (let i = 0; i < word.length; i++) {
			const letter = word.charAt(i);
			const currentFreq = letterFrequencies[letter];

			if (!currentFreq) {
				letterFrequencies[letter] = 1;
			} else {
				letterFrequencies[letter]++;
			}
		}

		return letterFrequencies;
	}

	static getTodaysWord() {
		const originDate = new Date('3/25/2022');
		const todaysDate = new Date();
		const daysSinceOrigin = DateUtils.daysBetween(originDate, todaysDate);
		const wordIndex = daysSinceOrigin % possibleAnswers.length;

		return possibleAnswers[wordIndex];
	}

	static isValidGuess(guess: string) {
		const guessIsPossibleAnswer = possibleAnswers.some(
			(possibleAnswer) => possibleAnswer.word == guess
		);

		if (guessIsPossibleAnswer) {
			return true;
		}

		const guessIsPossibleGuess = possibleGuesses.some(
			(possibleGuess) => possibleGuess == guess
		);

		if (guessIsPossibleGuess) {
			return true;
		}

		return false;
	}
}
