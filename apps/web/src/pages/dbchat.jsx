import { useState } from "react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Robot, PaperPlaneTilt, User, Database, ClockCounterClockwise } from "phosphor-react";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

import Layout from "@/components/layout/layout";
const Dbchat = () => {
  const [messages, setMessages] = useState([
    { id: 1, content: "Hello! How can I assist you today?", sender: "ai" },
  ]);
  const [input, setInput] = useState("");

  const handleSend = () => {
    if (input.trim()) {
      const newMessage = { id: messages.length + 1, content: input, sender: "user" };
      setMessages([...messages, newMessage]);
      setInput("");
      // Simulate AI response
      setTimeout(() => {
        const aiResponse = {
          id: messages.length + 2,
          content: "I'm an AI assistant. How can I help you with your question?",
          sender: "ai",
        };
        setMessages((prevMessages) => [...prevMessages, aiResponse]);
      }, 1000);
    }
  };

  return (

    <div className="w-full max-w-5xl mx-auto h-[calc(100vh-8rem)] flex flex-col bg-card/30 border border-border/50 rounded-xl overflow-hidden shadow-sm">
      <div className="p-4 border-b border-border/50 bg-background/50 backdrop-blur-md flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="bg-primary/10 p-2 rounded-lg">
            <Database className="w-5 h-5 text-primary" />
          </div>
          <div>
            <h1 className="text-sm font-bold tracking-tight">Database Assistant</h1>
            <p className="text-[10px] text-muted-foreground font-medium uppercase tracking-wider">Connected to MongoDB</p>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <Select>
            <SelectTrigger className="h-8 w-[140px] text-xs border-border/50 bg-background/50">
              <SelectValue placeholder="Select Database" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectItem value="MongoDB" className="text-xs">MongoDB</SelectItem>
                <SelectItem value="MySql" className="text-xs">MySQL</SelectItem>
                <SelectItem value="PostgreSQL" className="text-xs">PostgreSQL</SelectItem>
              </SelectGroup>
            </SelectContent>
          </Select>
          <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-foreground">
            <ClockCounterClockwise size={16} className="shrink-0" />
          </Button>
        </div>
      </div>

      <ScrollArea className="flex-grow p-6">
        <div className="space-y-6">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex ${message.sender === "user" ? "justify-end" : "justify-start"}`}
            >
              <div
                className={`flex items-end space-x-3 ${message.sender === "user" ? "flex-row-reverse space-x-reverse" : "flex-row"
                  }`}
              >
                <div className={`flex-shrink-0 h-8 w-8 rounded-full flex items-center justify-center border ${message.sender === "user" ? "bg-primary/10 border-primary/20" : "bg-muted border-border/50"
                  }`}>
                  {message.sender === "user" ? (
                    <User size={16} className="text-primary shrink-0" />
                  ) : (
                    <Robot size={16} className="text-foreground/70 shrink-0" />
                  )}
                </div>
                <div
                  className={`relative px-4 py-3 text-sm shadow-sm ${message.sender === "user"
                    ? "bg-primary text-primary-foreground rounded-2xl rounded-tr-none"
                    : "bg-card border border-border/50 text-foreground rounded-2xl rounded-tl-none"
                    }`}
                >
                  {message.content}
                </div>
              </div>
            </div>
          ))}
        </div>
      </ScrollArea>

      <div className="p-4 bg-background/50 border-t border-border/50">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSend();
          }}
          className="relative flex items-center"
        >
          <Input
            className="pr-12 h-12 bg-background border-border/50 focus:border-primary/50 transition-all rounded-xl shadow-inner"
            placeholder="Ask anything about your database..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
          />
          <Button type="submit" size="icon" className="absolute right-1.5 h-9 w-9 rounded-lg shadow-md hover:shadow-lg transition-all" disabled={!input.trim()}>
            <PaperPlaneTilt size={16} className="shrink-0" />
            <span className="sr-only">Send message</span>
          </Button>
        </form>
        <p className="text-[10px] text-center text-muted-foreground mt-3 font-medium uppercase tracking-widest opacity-60">
          AI can make mistakes. Check important info.
        </p>
      </div>
    </div>

  );
};

export default Dbchat;
