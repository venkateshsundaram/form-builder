import { Form, Question, FormResponse } from '../types/form';

const STORAGE_KEY = 'form_builder_data';

function getRandomDelay(): number {
  return Math.floor(Math.random() * 2000) + 1000; // 1-3 seconds
}

export async function saveQuestion(formId: string, question: Question): Promise<Question> {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
  
      try {
        const storage = localStorage.getItem(STORAGE_KEY);
        const data: Record<string, Form> = storage ? JSON.parse(storage) : {};
        
        if (!data[formId]) {
          data[formId] = {
            id: formId,
            title: 'Untitled Form',
            questions: []
          };
        }

        const existingQuestionIndex = data[formId].questions.findIndex(q => q.id === question.id);
        
        if (existingQuestionIndex !== -1) {
          data[formId].questions[existingQuestionIndex] = question;
        } else {
          data[formId].questions.push(question);
        }

        localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
        resolve(question);
      } catch (error) {
        reject(new Error('Failed to save question'));
      }
    }, getRandomDelay());
  });
}

export async function deleteQuestion(formId: string, questionId: string): Promise<void> {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
    
      try {
        const storage = localStorage.getItem(STORAGE_KEY);
        const data: Record<string, Form> = storage ? JSON.parse(storage) : {};
        
        if (data[formId]) {
          data[formId].questions = data[formId].questions.filter(q => q.id !== questionId);
          localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
        }
        
        resolve();
      } catch (error) {
        reject(new Error('Failed to delete question'));
      }
    }, getRandomDelay());
  });
}

export async function getForm(formId: string): Promise<Form | null> {
  return new Promise((resolve, reject) => {
    setTimeout(() => {

      try {
        const storage = localStorage.getItem(STORAGE_KEY);
        const data: Record<string, Form> = storage ? JSON.parse(storage) : {};
        resolve(data[formId] || null);
      } catch (error) {
        reject(new Error('Failed to fetch form'));
      }
    }, getRandomDelay());
  });
}

export async function saveFormResponse(response: FormResponse): Promise<void> {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      try {
        const storageKey = `form_responses_${response.formId}`;
        const storage = localStorage.getItem(storageKey);
        const responses: FormResponse[] = storage ? JSON.parse(storage) : [];
        responses.push(response);
        localStorage.setItem(storageKey, JSON.stringify(responses));
        resolve();
      } catch (error) {
        reject(new Error('Failed to save form response'));
      }
    }, getRandomDelay());
  });
}

export function debounce<T extends (...args: any[]) => any>(func: T, delay: number) {
  let timeoutId: any;

  return function (this: ThisParameterType<T>, ...args: Parameters<T>) {
    clearTimeout(timeoutId);

    timeoutId = setTimeout(() => {
      func.apply(this, args);
    }, delay);
  };
}