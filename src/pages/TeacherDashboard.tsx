import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import AnimatedBackground from '@/components/AnimatedBackground';
import {
  getQuestionSets,
  saveQuestionSet,
  deleteQuestionSet,
  generateId,
  teacherLogout,
  isTeacherLoggedIn,
  type QuestionSet,
  type TeacherQuestion,
} from '@/lib/teacherStorage';
import { playClickSound, playSuccessSound } from '@/lib/sounds';
import { ArrowLeft, Plus, Trash2, Edit, LogOut, Save, X, Check } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const TeacherDashboard: React.FC = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [questionSets, setQuestionSets] = useState<QuestionSet[]>(getQuestionSets());
  const [editingSet, setEditingSet] = useState<QuestionSet | null>(null);
  const [isCreating, setIsCreating] = useState(false);

  React.useEffect(() => {
    if (!isTeacherLoggedIn()) {
      navigate('/teacher');
    }
  }, [navigate]);

  const handleLogout = () => {
    playClickSound();
    teacherLogout();
    navigate('/');
  };

  const handleCreateNew = () => {
    playClickSound();
    const newSet: QuestionSet = {
      id: generateId(),
      name: '',
      questions: [],
      createdAt: Date.now(),
    };
    setEditingSet(newSet);
    setIsCreating(true);
  };

  const handleEditSet = (set: QuestionSet) => {
    playClickSound();
    setEditingSet({ ...set, questions: [...set.questions] });
    setIsCreating(false);
  };

  const handleDeleteSet = (id: string) => {
    playClickSound();
    deleteQuestionSet(id);
    setQuestionSets(getQuestionSets());
    toast({
      title: "Question Set Deleted",
      description: "The question set has been removed.",
    });
  };

  const handleSaveSet = () => {
    if (!editingSet || !editingSet.name.trim()) {
      toast({
        title: "Name Required",
        description: "Please enter a name for the question set.",
        variant: "destructive",
      });
      return;
    }

    if (editingSet.questions.length === 0) {
      toast({
        title: "Questions Required",
        description: "Please add at least one question.",
        variant: "destructive",
      });
      return;
    }

    playSuccessSound();
    saveQuestionSet(editingSet);
    setQuestionSets(getQuestionSets());
    setEditingSet(null);
    setIsCreating(false);
    toast({
      title: "Saved!",
      description: "Question set has been saved successfully.",
    });
  };

  const handleCancel = () => {
    playClickSound();
    setEditingSet(null);
    setIsCreating(false);
  };

  const addQuestion = () => {
    if (!editingSet) return;
    playClickSound();
    const newQuestion: TeacherQuestion = {
      id: generateId(),
      question: '',
      options: ['', '', '', ''],
      correctIndex: 0,
      hint: '',
    };
    setEditingSet({
      ...editingSet,
      questions: [...editingSet.questions, newQuestion],
    });
  };

  const updateQuestion = (index: number, field: keyof TeacherQuestion, value: string | number) => {
    if (!editingSet) return;
    const questions = [...editingSet.questions];
    questions[index] = { ...questions[index], [field]: value };
    setEditingSet({ ...editingSet, questions });
  };

  const updateOption = (qIndex: number, oIndex: number, value: string) => {
    if (!editingSet) return;
    const questions = [...editingSet.questions];
    const options = [...questions[qIndex].options] as [string, string, string, string];
    options[oIndex] = value;
    questions[qIndex] = { ...questions[qIndex], options };
    setEditingSet({ ...editingSet, questions });
  };

  const removeQuestion = (index: number) => {
    if (!editingSet) return;
    playClickSound();
    const questions = editingSet.questions.filter((_, i) => i !== index);
    setEditingSet({ ...editingSet, questions });
  };

  if (editingSet) {
    return (
      <main className="relative min-h-screen overflow-hidden">
        <AnimatedBackground />

        <div className="relative z-10 min-h-screen p-4 md:p-8">
          <div className="max-w-4xl mx-auto">
            <div className="flex items-center justify-between mb-6">
              <Button variant="outline" onClick={handleCancel} className="font-fredoka">
                <X className="w-5 h-5 mr-2" />
                Cancel
              </Button>
              <h1 className="text-2xl md:text-3xl font-baloo font-bold text-foreground">
                {isCreating ? 'Create Question Set' : 'Edit Question Set'}
              </h1>
              <Button variant="treasure" onClick={handleSaveSet} className="font-fredoka">
                <Save className="w-5 h-5 mr-2" />
                Save
              </Button>
            </div>

            <div className="bg-card/90 backdrop-blur-sm rounded-3xl p-6 shadow-2xl mb-6">
              <label className="block text-lg font-fredoka text-foreground mb-2">
                Question Set Name
              </label>
              <Input
                placeholder="e.g., Chapter 1 – Algebra"
                value={editingSet.name}
                onChange={(e) => setEditingSet({ ...editingSet, name: e.target.value })}
                className="text-lg font-fredoka"
              />
            </div>

            <div className="space-y-4">
              {editingSet.questions.map((q, qIndex) => (
                <div key={q.id} className="bg-card/90 backdrop-blur-sm rounded-2xl p-5 shadow-xl">
                  <div className="flex items-center justify-between mb-4">
                    <span className="font-baloo text-lg text-foreground">
                      Question {qIndex + 1}
                    </span>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => removeQuestion(qIndex)}
                      className="text-destructive hover:text-destructive"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>

                  <div className="space-y-4">
                    <Input
                      placeholder="Enter question (e.g., 5 + 3 = ?)"
                      value={q.question}
                      onChange={(e) => updateQuestion(qIndex, 'question', e.target.value)}
                      className="font-fredoka"
                    />

                    <div className="grid grid-cols-2 gap-3">
                      {q.options.map((opt, oIndex) => (
                        <div key={oIndex} className="relative">
                          <Input
                            placeholder={`Option ${oIndex + 1}`}
                            value={opt}
                            onChange={(e) => updateOption(qIndex, oIndex, e.target.value)}
                            className={`font-fredoka pr-10 ${q.correctIndex === oIndex ? 'border-accent ring-2 ring-accent/30' : ''}`}
                          />
                          <button
                            onClick={() => updateQuestion(qIndex, 'correctIndex', oIndex)}
                            className={`absolute right-2 top-1/2 -translate-y-1/2 w-6 h-6 rounded-full flex items-center justify-center ${
                              q.correctIndex === oIndex
                                ? 'bg-accent text-accent-foreground'
                                : 'bg-muted text-muted-foreground hover:bg-accent/50'
                            }`}
                          >
                            <Check className="w-4 h-4" />
                          </button>
                        </div>
                      ))}
                    </div>

                    <Input
                      placeholder="Add a hint for this question"
                      value={q.hint}
                      onChange={(e) => updateQuestion(qIndex, 'hint', e.target.value)}
                      className="font-fredoka"
                    />
                  </div>
                </div>
              ))}

              <Button
                variant="outline"
                onClick={addQuestion}
                className="w-full h-16 text-lg font-fredoka border-dashed border-2"
              >
                <Plus className="w-6 h-6 mr-2" />
                Add Question
              </Button>
            </div>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="relative min-h-screen overflow-hidden">
      <AnimatedBackground />

      <div className="relative z-10 min-h-screen p-4 md:p-8">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center justify-between mb-8">
            <Button variant="outline" onClick={() => navigate('/')} className="font-fredoka">
              <ArrowLeft className="w-5 h-5 mr-2" />
              Home
            </Button>
            <h1 className="text-2xl md:text-4xl font-baloo font-bold text-foreground text-shadow-fun">
              🎓 Teacher Dashboard
            </h1>
            <Button variant="ghost" onClick={handleLogout} className="font-fredoka text-destructive">
              <LogOut className="w-5 h-5 mr-2" />
              Logout
            </Button>
          </div>

          <Button
            variant="treasure"
            size="lg"
            onClick={handleCreateNew}
            className="w-full mb-8 font-fredoka text-xl"
          >
            <Plus className="w-6 h-6 mr-2" />
            Create New Question Set
          </Button>

          {questionSets.length === 0 ? (
            <div className="bg-card/80 backdrop-blur-sm rounded-3xl p-10 text-center">
              <p className="text-xl font-fredoka text-muted-foreground">
                No question sets yet. Create your first one!
              </p>
            </div>
          ) : (
            <div className="grid gap-4">
              {questionSets.map((set) => (
                <div
                  key={set.id}
                  className="bg-card/90 backdrop-blur-sm rounded-2xl p-5 shadow-xl flex items-center justify-between"
                >
                  <div>
                    <h3 className="text-xl font-baloo font-bold text-foreground">{set.name}</h3>
                    <p className="text-muted-foreground font-fredoka">
                      {set.questions.length} question{set.questions.length !== 1 ? 's' : ''}
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm" onClick={() => handleEditSet(set)}>
                      <Edit className="w-4 h-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDeleteSet(set.id)}
                      className="text-destructive hover:text-destructive"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </main>
  );
};

export default TeacherDashboard;
