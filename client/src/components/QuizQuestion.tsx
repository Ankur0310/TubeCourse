import React, { useState } from 'react';
import { CheckCircle, XCircle } from 'lucide-react';
import { QuizQuestion as QuizQuestionType } from '../types/course';

interface QuizQuestionProps {
  question?: QuizQuestionType;
  questionIndex: number;
}

export const QuizQuestion: React.FC<QuizQuestionProps> = ({ question, questionIndex }) => {
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [showResult, setShowResult] = useState(false);

  //console.log("Rendering QuizQuestion", question, questionIndex);

  if (!question || !Array.isArray(question.options)) {
    return (
      <div className="bg-red-50 border border-red-200 text-red-600 rounded-lg p-4">
        <p>Invalid quiz question data. Please check the course content.</p>
      </div>
    );
  }

  const handleAnswerSelect = (optionIndex: number) => {
    setSelectedAnswer(optionIndex);
    setShowResult(true);
  };

  const correctAnswerIndex = Number(question.correctAnswer);
  const isAnswerValid = !isNaN(correctAnswerIndex) && correctAnswerIndex >= 0 && correctAnswerIndex < question.options.length;

  return (
    <div className="bg-white rounded-lg p-4 border border-gray-200"> 
      <h5 className="font-medium text-gray-800 mb-3"> 
        {questionIndex + 1}. {question.question}
      </h5>
      <div className="space-y-2">
        {(question.options ?? []).map((option, index) => {
          const isCorrect = isAnswerValid && index === correctAnswerIndex;
          const isSelected = selectedAnswer === index;

          let buttonClass = "w-full text-left p-3 rounded-lg border transition-all duration-200 ";

          if (!showResult) {
            buttonClass += "border-gray-200 hover:border-red-300 hover:bg-red-50 text-gray-700";
          } else {
            if (isCorrect) {
              buttonClass += "border-green-300 bg-green-100 text-green-800"; 
            } else if (isSelected && !isCorrect) {
              buttonClass += "border-red-300 bg-red-100 text-red-800"; 
            } else {
              buttonClass += "border-gray-200 bg-gray-50 text-gray-600"; 
            }
          }

          return (
            <button
              key={index}
              onClick={() => !showResult && handleAnswerSelect(index)}
              className={buttonClass}
              disabled={showResult}
            >
              <div className="flex items-center justify-between">
                <span>{option}</span>
                {showResult && (
                  <div>
                    {isCorrect && <CheckCircle className="w-5 h-5 text-green-600" />}
                    {isSelected && !isCorrect && <XCircle className="w-5 h-5 text-red-600" />}
                  </div>
                )}
              </div>
            </button>
          );
        })}
      </div>

      {showResult && isAnswerValid && (
        <div className="mt-3 p-3 bg-gray-50 rounded-lg border border-gray-200"> 
          <p className="text-sm">
            {selectedAnswer === correctAnswerIndex ? (
              <span className="text-green-600 font-medium">✓ Correct!</span>
            ) : (
              <span className="text-red-600 font-medium">
                ✗ Incorrect. The correct answer is: <strong>{question.options[correctAnswerIndex]}</strong>
              </span>
            )}
          </p>
        </div>
      )}
    </div>
  );
};
