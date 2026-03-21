import { useModalStack } from "@/contexts/ModalStackContext";
import { RiskDetailModal } from "@/components/RiskDetailModal";
import { ObjectDetailModal } from "@/components/ObjectDetailModal";

export function ModalStack() {
  const { stack, closeTop, openRisk, openObject } = useModalStack();

  return (
    <>
      {stack.map((entry, index) => {
        const zIndex = 50 + index * 10;
        if (entry.type === "risk") {
          return (
            <div key={`risk-${entry.id}-${index}`} style={{ zIndex }}>
              <RiskDetailModal
                riskId={entry.id}
                onClose={closeTop}
                onOpenObject={openObject}
              />
            </div>
          );
        }
        if (entry.type === "object") {
          return (
            <div key={`object-${entry.id}-${index}`} style={{ zIndex }}>
              <ObjectDetailModal
                objectId={entry.id}
                onClose={closeTop}
                onOpenRisk={openRisk}
              />
            </div>
          );
        }
        return null;
      })}
    </>
  );
}
