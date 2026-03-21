import { useModalStack } from "@/contexts/ModalStackContext";
import { RiskDetailModal } from "@/components/RiskDetailModal";
import { ObjectDetailModal } from "@/components/ObjectDetailModal";

export function ModalStack() {
  const { stack, closeTop, openRisk, openObject } = useModalStack();

  return (
    <>
      {stack.map((entry, index) => {
        const zBase = 50 + index * 10;
        if (entry.type === "risk") {
          return (
            <RiskDetailModal
              key={`risk-${entry.id}-${index}`}
              riskId={entry.id}
              onClose={closeTop}
              onOpenObject={openObject}
              zIndex={zBase}
            />
          );
        }
        if (entry.type === "object") {
          return (
            <ObjectDetailModal
              key={`object-${entry.id}-${index}`}
              objectId={entry.id}
              onClose={closeTop}
              onOpenRisk={openRisk}
              zIndex={zBase}
            />
          );
        }
        return null;
      })}
    </>
  );
}
