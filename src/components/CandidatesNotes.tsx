"use client";

import { useEffect, useState } from "react";
import { db, Note } from "@/mock/db";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";

interface CandidateNotesProps {
  candidateId: number;
}

export default function CandidateNotes({ candidateId }: CandidateNotesProps) {
  const [notes, setNotes] = useState<Note[]>([]);
  const [newNote, setNewNote] = useState("");
  const [author, setAuthor] = useState("Recruiter");

  useEffect(() => {
    loadNotes();
  }, [candidateId]);

  async function loadNotes() {
    const n = await db.notes
      .where("candidateId")
      .equals(candidateId)
      .reverse()
      .sortBy("createdAt");
    setNotes(n);
  }

  async function addNote() {
    if (!newNote.trim()) return;

    const note: Note = {
      candidateId,
      author,
      content: newNote,
      createdAt: new Date().toISOString(),
    };

    await db.notes.add(note);
    setNewNote("");
    await loadNotes();
  }

  async function deleteNote(id?: number) {
    if (!id) return;
    await db.notes.delete(id);
    await loadNotes();
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Notes & Comments</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Add Note */}
        <div className="flex flex-col gap-2">
          <Input
            placeholder="Your name"
            value={author}
            onChange={(e) => setAuthor(e.target.value)}
          />
          <Textarea
            placeholder="Write a note..."
            value={newNote}
            onChange={(e) => setNewNote(e.target.value)}
          />
          <Button onClick={addNote}>Add Note</Button>
        </div>

        {/* Notes List */}
        <div className="space-y-3">
          {notes.length === 0 && (
            <p className="text-sm text-gray-500">No notes yet.</p>
          )}
          {notes.map((note) => (
            <div
              key={note.id}
              className="p-3 border rounded-lg bg-gray-50 flex justify-between items-start"
            >
              <div>
                <p className="text-sm">{note.content}</p>
                <p className="text-xs text-gray-500 mt-1">
                  — {note.author} •{" "}
                  {new Date(note.createdAt).toLocaleDateString()}
                </p>
              </div>
              <Button
                size="sm"
                variant="ghost"
                onClick={() => deleteNote(note.id)}
              >
                ❌
              </Button>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
