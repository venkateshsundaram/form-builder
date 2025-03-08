import { Toaster } from 'react-hot-toast';

import { QUESTION_BUILDER_ID } from './constants/application';
import QuestionBuilder from './pages/dashboard/QuestionBuilder';

function App() {

  return (
    <div className="min-h-screen bg-gray-50">
      <Toaster position="top-right" />
      <main className="max-w-7xl mx-auto px-4 py-8">
          <QuestionBuilder
            questionBuilderId={QUESTION_BUILDER_ID} />
      </main>
    </div>
  );
}

export default App;