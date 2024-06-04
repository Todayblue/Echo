"use client";
import React from "react";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {Pencil, Trash} from "lucide-react";
import {Button} from "@/components/ui/button";
import Link from "next/link";
import {AlertDialogDelete} from "./AlertDialogDelete";
import {Rule, Community, Role} from "@prisma/client";
import {useSession} from "next-auth/react";
import {Card} from "@/components/ui/card";

type Props = {
  community: Community | undefined;
  rules: Rule[] | undefined;
};

const RuleList = ({community, rules}: Props) => {
  const {data: session, status} = useSession();

  return (
    <Card className="order-first md:order-last">
      <div className="mx-6 pt-4 ">
        <p className="capitalize font-semibold py-3 border-b border-gray-300 ">
          {community?.name}/ Rules
        </p>
      </div>
      <dl className="divide-y divide-gray-100 px-6 py-4 text-sm leading-4 ">
        {rules?.length === 0 ? (
          <Accordion type="single" collapsible>
            <AccordionItem value="item-1">
              <AccordionTrigger>
                This Community has no rules !!
              </AccordionTrigger>
            </AccordionItem>
          </Accordion>
        ) : (
          <Accordion type="single" collapsible>
            {rules?.map((rule) => (
              <AccordionItem value={rule.id} key={rule.id}>
                <AccordionTrigger className="text-left">
                  {rule.title}
                </AccordionTrigger>
                <AccordionContent>
                  <AccordionContent>{rule.description}</AccordionContent>
                  {(community?.creatorId === session?.user?.id ||
                    session?.user.role === Role.ADMIN) && (
                    <div className="flex flex-row space-x-2 justify-end mx-2">
                      <Button variant="outline" size="icon">
                        <Link
                          href={`/community/${community?.slug}/rule/edit/${rule.id}`}
                        >
                          <Pencil className="h-4 w-4" />
                        </Link>
                      </Button>
                      <AlertDialogDelete
                        communitySlug={community?.slug || ""}
                        ruleId={rule.id}
                      />
                    </div>
                  )}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        )}
        {(community?.creatorId === session?.user?.id ||
          session?.user.role === Role.ADMIN) && (
          <Link href={`/community/${community?.slug}/rule/create`}>
            <Button className="w-full">Create Rules</Button>
          </Link>
        )}
      </dl>
    </Card>
  );
};

export default RuleList;
