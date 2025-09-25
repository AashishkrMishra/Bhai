import React, { useState, useRef, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { db, Note } from "@/mock/db";
import { Trash2, ChevronDown } from "lucide-react"; // Import icons
import { motion, AnimatePresence } from "framer-motion"; // Import for animation

// --- Mock Data for @mentions ---
const teamMembers = [
  "Sarah Johnson",
  "Michael Chen",
  "Emily Rodriguez",
  "David Lee",
  "Jessica Williams",
  "Chris Brown",
  "Amanda Miller",
];

// --- NoteItem Sub-Component for individual note logic and animation ---
type NoteItemProps = {
    note: Note;
    isExpanded: boolean;
    onToggle: () => void;
    onDelete: () => void;
};

const NoteItem: React.FC<NoteItemProps> = ({ note, isExpanded, onToggle, onDelete }) => {
    return (
        <div className="bg-slate-50 dark:bg-slate-700/50 rounded-md transition-colors duration-300 overflow-hidden border border-slate-200 dark:border-slate-700">
            {/* Clickable header to toggle expansion */}
            <div 
                className="p-3 flex justify-between items-center group cursor-pointer"
                onClick={onToggle}
            >
                <p className="text-xs text-slate-500 dark:text-slate-400">
                    — {note.author} • {new Date(note.createdAt).toLocaleDateString()}
                </p>

                <div className="flex items-center">
                    {/* Delete button appears on hover */}
                    <Button
                        size="icon"
                        variant="ghost"
                        className="h-7 w-7 text-slate-400 hover:text-red-500 dark:hover:text-red-400 opacity-0 group-hover:opacity-100 transition-opacity"
                        onClick={(e) => {
                            e.stopPropagation(); // Prevent toggling when deleting
                            onDelete();
                        }}
                        aria-label="Delete note"
                    >
                        <Trash2 size={16} />
                    </Button>
                    {/* Animated chevron icon */}
                    <motion.div
                        animate={{ rotate: isExpanded ? 180 : 0 }}
                        transition={{ duration: 0.3 }}
                        className="ml-2"
                    >
                        <ChevronDown size={16} className="text-slate-500 dark:text-slate-400" />
                    </motion.div>
                </div>
            </div>

            {/* Collapsible content with animation */}
            <AnimatePresence initial={false}>
                {isExpanded && (
                    <motion.div
                        key="content"
                        initial="collapsed"
                        animate="open"
                        exit="collapsed"
                        variants={{
                            open: { opacity: 1, height: 'auto', y: 0 },
                            collapsed: { opacity: 0, height: 0, y: -10 }
                        }}
                        transition={{ duration: 0.3, ease: [0.04, 0.62, 0.23, 0.98] }}
                        className="px-3 pb-3"
                    >
                        <p className="text-slate-700 dark:text-slate-300 whitespace-pre-wrap border-t border-slate-200 dark:border-slate-600 pt-3">
                            {note.content}
                        </p>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

// --- Main Component ---
type CandidateNotesProps = {
  candidateId: number;
};

export default function CandidateNotes({ candidateId }: CandidateNotesProps) {
  const [newNote, setNewNote] = useState("");
  const [notes, setNotes] = useState<Note[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [expandedNoteId, setExpandedNoteId] = useState<number | null>(null); // State to track expanded note
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (!candidateId) return;
    const fetchNotes = async () => {
      const n = await db.notes
        .where("candidateId")
        .equals(candidateId)
        .reverse()
        .sortBy("createdAt");
      setNotes(n);
    };
    fetchNotes();
  }, [candidateId]);

  const handleAddNote = async () => {
    if (newNote.trim() === "") return;
    const note: Note = {
      candidateId,
      content: newNote,
      author: "Recruiter",
      createdAt: new Date().toISOString(),
    };
    const id = await db.notes.add(note);
    setNotes([{ ...note, id }, ...notes]);
    setNewNote("");
  };

  const deleteNote = async (id?: number) => {
    if (!id) return;
    await db.notes.delete(id);
    setNotes(notes.filter((note) => note.id !== id));
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const text = e.target.value;
    setNewNote(text);
    const mentionMatch = text.match(/@(\w*)$/);

    if (mentionMatch) {
      const query = mentionMatch[1].toLowerCase();
      setSuggestions(
        teamMembers.filter((name) => name.toLowerCase().includes(query))
      );
      setShowSuggestions(true);
    } else {
      setShowSuggestions(false);
    }
  };

  const handleSuggestionClick = (name: string) => {
    const newText = newNote.replace(/@(\w*)$/, `@${name} `);
    setNewNote(newText);
    setShowSuggestions(false);
    textareaRef.current?.focus();
  };

  // --- Toggles which note is expanded ---
  const handleToggleNote = (id: number) => {
    setExpandedNoteId(expandedNoteId === id ? null : id);
  };

  return (
    <Card className="p-6 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-sm transition-colors duration-300 ease-in-out">
      <h2 className="text-xl font-bold text-slate-800 dark:text-slate-100 mb-4">
        Notes & Comments
      </h2>
      <div className="space-y-4">
        <p className="text-sm font-medium text-slate-600 dark:text-slate-400">Recruiter</p>
        <div className="relative">
          <Textarea
            ref={textareaRef}
            value={newNote}
            onChange={handleInputChange}
            placeholder="Write a note... Start with @ to mention someone"
            className="w-full p-2 border rounded-md bg-slate-50 dark:bg-slate-700 border-slate-300 dark:border-slate-600 text-slate-800 dark:text-slate-200 focus:ring-2 focus:ring-blue-500 transition-colors duration-300"
          />
          {showSuggestions && suggestions.length > 0 && (
            <div className="absolute z-10 w-full mt-1 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-md shadow-lg max-h-48 overflow-y-auto">
              <ul>
                {suggestions.map((name, index) => (
                  <li
                    key={index}
                    onClick={() => handleSuggestionClick(name)}
                    className="px-4 py-2 cursor-pointer hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 transition-colors duration-200"
                  >
                    {name}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
        <Button 
          onClick={handleAddNote}
          className="w-full bg-green-600 hover:bg-green-700 dark:bg-green-700 dark:hover:bg-green-800 text-white font-semibold transition-colors duration-300"
        >
          Add Note
        </Button>

        <div className="space-y-3 pt-4 border-t border-slate-200 dark:border-slate-700 transition-colors duration-300">
          {notes.length > 0 ? (
            notes.map((note) => (
              <NoteItem
                key={note.id}
                note={note}
                isExpanded={expandedNoteId === note.id}
                onToggle={() => handleToggleNote(note.id!)}
                onDelete={() => deleteNote(note.id)}
              />
            ))
          ) : (
            <p className="text-sm text-slate-500 dark:text-slate-400 text-center py-4">No notes yet.</p>
          )}
        </div>
      </div>
    </Card>
  );
}

