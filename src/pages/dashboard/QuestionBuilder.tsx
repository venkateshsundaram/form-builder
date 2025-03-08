import { useState, useCallback, useEffect } from "react";
import { Plus } from "lucide-react";
import { toast } from "react-hot-toast";
import {
    DndContext,
    closestCenter,
    KeyboardSensor,
    PointerSensor,
    useSensor,
    useSensors,
    DragEndEvent
} from "@dnd-kit/core";
import {
    arrayMove,
    SortableContext,
    sortableKeyboardCoordinates,
    verticalListSortingStrategy
} from "@dnd-kit/sortable";
import { Question } from "../../types/form";
import { saveQuestion, deleteQuestion } from "../../utils/api";
import QuestionEditor from "./QuestionEditor";

interface QuestionBuilderProps {
    questionBuilderId: string,
    questionsData: Question[],
    updateLoadingState: (isLoading: boolean) => void
}

export default function QuestionBuilder({ questionsData, questionBuilderId, updateLoadingState }: QuestionBuilderProps) {
    const [questions, setQuestions] = useState<Question[]>([]);
    const [savingQuestions, setSavingQuestions] = useState<Set<string>>(new Set());
    const [savedQuestions, setSavedQuestions] = useState<Set<string>>(new Set());

    useEffect(() => {
        setQuestions(questionsData);
    }, [questionsData]);
    
    const sensors = useSensors(
        useSensor(PointerSensor),
        useSensor(KeyboardSensor, {
            coordinateGetter: sortableKeyboardCoordinates,
        })
    );

    const handleAddQuestion = () => {
        const newQuestion: Question = {
            id: crypto.randomUUID(),
            questionType: "",
            label: '',
            required: false,
            hidden: false
        };
        setQuestions(prev => [...prev, newQuestion]);
    };

    const handleQuestionChange = useCallback(async (question: Question) => {
        setSavingQuestions(prev => new Set(prev).add(question.id));

        try {
            await saveQuestion(questionBuilderId, question);
            setQuestions(prev =>
                prev.map(q => q.id === question.id ? question : q)
            );
            // toast.success('Question saved');
        } catch (error) {
            // toast.error('Failed to save question');
        } finally {
            setSavingQuestions(prev => {
                const next = new Set(prev);
                next.delete(question.id);
                return next;
            });
            setSavedQuestions(prev => new Set(prev).add(question.id));
        }
    }, [questionBuilderId]);

    const handleDeleteQuestion = async (id: string) => {
        try {
            updateLoadingState(true);
            await deleteQuestion(questionBuilderId, id);
            setQuestions(prev => prev.filter(q => q.id !== id));
            toast.success('Question deleted');
        } catch (error) {
            toast.error('Failed to delete question');
        } finally {
            updateLoadingState(false);
        }
    };

    const handleDragEnd = (event: DragEndEvent) => {
        const { active, over } = event;

        if (over && active.id !== over.id) {
            setQuestions((items) => {
                const oldIndex = items.findIndex((q) => q.id === active.id);
                const newIndex = items.findIndex((q) => q.id === over.id);
                return arrayMove(items, oldIndex, newIndex);
            });
        }
    };

    return (
        <div className="max-w-3xl mx-auto p-6">
            <DndContext
                sensors={sensors}
                collisionDetection={closestCenter}
                onDragEnd={handleDragEnd}
            >
                <div className="space-y-4">
                    <SortableContext
                        items={questions.map(q => q.id)}
                        strategy={verticalListSortingStrategy}
                    >
                        {questions.map(question => (
                            <QuestionEditor
                                key={question.id}
                                question={question}
                                onChange={handleQuestionChange}
                                onDelete={handleDeleteQuestion}
                                isSaving={savingQuestions.has(question.id)}
                                saved={savedQuestions.has(question.id)}
                                resetSavedStaus={() => setSavedQuestions(prev => {
                                    const next = new Set(prev);
                                    next.delete(question.id);
                                    return next;
                                })}
                            />
                        ))}
                    </SortableContext>
                    <button
                        onClick={handleAddQuestion}
                        className="w-full py-4 border-2 border-dashed border-gray-300 rounded-lg
                     flex items-center justify-center gap-2 text-gray-500 hover:text-gray-700
                     hover:border-gray-400 transition-colors"
                    >
                        <Plus className="w-5 h-5" />
                        Add Question
                    </button>
                </div>
            </DndContext>
        </div>
    );
}