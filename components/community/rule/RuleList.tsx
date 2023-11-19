"use client";
import React from "react";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Pencil, Trash } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { AlertDialogDelete } from "./AlertDialogDelete";

enum UserRole {
  USER = "USER",
  ADMIN = "ADMIN",
}

type RuleProps = {
  rules: {
    id: string;
    title: string;
    description: string;
    authorId: string;
    communityId: string;
  }[];
  session: {
    user: {
      name: string;
      email: string;
      image: string;
      id: string;
      role: UserRole;
    };
  } | null;
  communityName: string;
  communityCreatorId: string;
  communitySlug: string | null;
};

const RuleList = ({
  session,
  communityCreatorId,
  communityName,
  communitySlug,
  rules,
}: RuleProps) => {
  return (
    <div className="w-screen  md:w-full bg-white h-fit rounded-lg border border-gray-300 order-first md:order-last">
      <div className="mx-6 pt-4 ">
        <p className="capitalize font-semibold py-3 border-b border-gray-300 ">
          {communityName}/ Rules
        </p>
      </div>
      <dl className="divide-y divide-gray-100 px-6 py-4 text-sm leading-4 ">
        {rules.length === 0 ? (
          <Accordion type="single" collapsible>
            <AccordionItem value="item-1">
              <AccordionTrigger>
                This Community has no rules !!
              </AccordionTrigger>
            </AccordionItem>
          </Accordion>
        ) : (
          <Accordion type="single" collapsible>
            {rules.map((rule) => (
              <AccordionItem value={rule.id} key={rule.id}>
                <AccordionTrigger className="text-left">
                  {rule.title}
                </AccordionTrigger>
                <AccordionContent>
                  <AccordionContent>{rule.description}</AccordionContent>
                  {communityCreatorId === session?.user?.id && (
                    <div className="flex flex-row space-x-2 justify-end mx-2">
                      <Button variant="outline" size="icon">
                        <Link
                          href={`/community/${communitySlug}/rule/edit/${rule.id}`}
                        >
                          <Pencil className="h-4 w-4" />
                        </Link>
                      </Button>
                      <AlertDialogDelete
                        session={session}
                        communitySlug={communitySlug}
                        ruleId={rule.id}
                      />
                    </div>
                  )}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        )}
        {communityCreatorId === session?.user?.id && (
          <Link href={`/community/${communitySlug}/rule/create`}>
            <Button className="w-full">Create Rules</Button>
          </Link>
        )}
      </dl>
    </div>
  );
};

export default RuleList;
