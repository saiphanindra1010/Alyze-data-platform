import { useState } from "react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Bot, Send, User,Database,History } from "lucide-react";
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
const dbchat = () => {
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
    <Layout>
    <div className=" w-full  max-w-7xl mx-auto h-full flex flex-col">
      <div className="p-4 flex justify-between ">
        {/* <h1 className="text-2xl font-bold">AI Chat Assistant</h1> */}
        <Select>
      <SelectTrigger className="w-[180px] border-transparent">
        <SelectValue placeholder="Select a Database" />
      </SelectTrigger>
      <SelectContent>
        <SelectGroup>
          <SelectLabel>Databases</SelectLabel>
          <SelectItem value="MongoDB">MongoDB</SelectItem>
          <SelectItem value="MySql">MySql</SelectItem>
          <SelectItem value="PostgreSQL">PostgreSQL</SelectItem>
        </SelectGroup>
      </SelectContent>
    </Select>
    <History/>
      </div>
      <ScrollArea className="flex-grow p-4">
        <div className="space-y-4">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex ${message.sender === "user" ? "justify-end" : "justify-start"}`}
            >
              <div
                className={`flex items-start space-x-2 ${
                  message.sender === "user" ? "flex-row-reverse space-x-reverse" : "flex-row"
                }`}
              >
             
                  {message.sender === "user" ? (
                    <User className="w-6 h-6 text-primary" />
                  ) : (
                    <Database className="w-6 h-6 text-primary" />
                  )}
                  {/* <AvatarFallback>{message.sender === "user" ? "" : ""}</AvatarFallback> */}
          
                <div
                  className={`rounded-lg p-2 max-w-[80%] ${
                    message.sender === "user" ? "bg-primary text-primary-foreground" : "bg-muted"
                  }`}
                >
                  {message.content}
                </div>
              </div>
            </div>
          ))}
        </div>
      </ScrollArea>
      <div className="p-4 ">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSend();
          }}
          className="flex space-x-2"
        >
          <Input
            className="flex-grow"
            placeholder="Type your message here..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
          />
          <Button type="submit" size="icon">
            <Send className="w-4 h-4" />
            <span className="sr-only">Send message</span>
          </Button>
        </form>
      </div>
    </div>
    </Layout>
  );
};

export default dbchat;
