import type { ApiProperty } from "@/lib/api-reference";
import type { ComponentType } from "react";

export type PlaygroundValue = string | boolean;

export type PlaygroundValues = Record<string, PlaygroundValue>;

export type Control =
    | {
          kind: "select";
          name: string;
          options: string[];
          defaultValue: string;
      }
    | {
          kind: "switch";
          name: string;
          defaultValue: boolean;
      }
    | {
          kind: "text";
          name: string;
          defaultValue: string;
          maxLengthCharacters: number;
      };

export type ControlOverrides = {
    exclude: string[];
    extras: Control[];
};

export type SnippetChildren =
    | {
          kind: "text";
          text: string;
      }
    | {
          kind: "icon";
          iconName: string;
      };

export type SnippetModel = {
    componentName: string;
    imports: readonly string[];
    props: [string, PlaygroundValue][];
    children: SnippetChildren;
};

export type IconComponents = Readonly<Partial<Record<string, ComponentType>>>;

export type PlaygroundEntryProps = {
    /** The component's public props, read on the server from its installed source. */
    properties: ApiProperty[];
};
