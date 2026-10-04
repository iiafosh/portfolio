import type { Skill } from "@/content/types"
import { BrandIcon, type BrandKey } from "./brand-icon"

/** sleek-portfolio's inline skill chip: dashed, inset, sits on the text line. */
export function SkillChip({ skill }: { skill: Skill }) {
  const content = (
    <>
      <BrandIcon name={skill.icon as BrandKey} />
      {skill.name}
    </>
  )
  return skill.href ? (
    <a href={skill.href} target="_blank" rel="noopener noreferrer" className="skill-chip">
      {content}
    </a>
  ) : (
    <span className="skill-chip">{content}</span>
  )
}
