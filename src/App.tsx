import { useEffect, useState } from 'react';
import { Toaster, toast } from 'react-hot-toast';
import { Loader } from 'lucide-react';

import { QUESTION_BUILDER_ID } from './constants/application';
import QuestionBuilder from './pages/dashboard/QuestionBuilder';
import { Question } from "./types/form";
import { getForm } from "./utils/api";

function App() {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  useEffect(() => {
    (async () => {
      try {
        const data: any = await getForm(QUESTION_BUILDER_ID);
        setQuestions(data?.questions|| []);
      } catch (error) {
        toast.error('Failed to fetch questions');
      } finally {
        setIsLoading(false);
      }
    })();
  }, []);

  return (
    <div className="min-h-screen bg-gray-50">
      <Toaster position="top-right" />
      <main className="max-w-7xl mx-auto px-4 py-8">
        {isLoading ? <div className="sm:flex sm:justify-center"><Loader size={150} className="w-150 h-150 center animate-spin text-blue-500" /> </div> :
          <QuestionBuilder
            questionsData={questions}
            updateLoadingState={setIsLoading}
            questionBuilderId={QUESTION_BUILDER_ID} />}
      </main>
    </div>
  );
}

export default App;