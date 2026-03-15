import React from 'react'
import { Check, ChevronRight } from 'lucide-react'

/**
 * WorkflowSteps Component - SIMPLIFIED
 * Shows only document titles, click to see location
 */
const WorkflowSteps = ({ 
    workflow, 
    completedSteps = [], 
    onStepClick,
    onStepComplete,
    showCompleted = true
}) => {
    if (!workflow || !workflow.steps) return null

    const { title, steps } = workflow

    return (
        <div className="mt-3">
            {/* Workflow Header - Simplified */}
            <div className="mb-3">
                <h4 className="text-white font-semibold flex items-center gap-2">
                    <ChevronRight className="w-4 h-4 text-brand" />
                    {title}
                </h4>
            </div>

            {/* Progress Bar */}
            {completedSteps.length > 0 && (
                <div className="mb-3">
                    <div className="flex justify-between text-xs text-gray-400 mb-1">
                        <span>Progres</span>
                        <span>{completedSteps.length}/{steps.length} pași</span>
                    </div>
                    <div className="h-1.5 bg-bg-dark rounded-full overflow-hidden">
                        <div 
                            className="h-full bg-brand transition-all duration-300"
                            style={{ width: `${(completedSteps.length / steps.length) * 100}%` }}
                        />
                    </div>
                </div>
            )}

            {/* Steps List - SIMPLE: Just document names */}
            <div className="space-y-1.5">
                {steps.map((step, index) => {
                    const isCompleted = completedSteps.includes(step.id)
                    const isClickable = !isCompleted || showCompleted

                    return (
                        <button
                            key={step.id}
                            onClick={() => isClickable && onStepClick?.(step)}
                            disabled={isCompleted && !showCompleted}
                            className={`
                                w-full text-left p-2.5 rounded-lg border transition-all flex items-center gap-2
                                ${isCompleted 
                                    ? 'bg-brand/5 border-brand/20 opacity-50' 
                                    : 'bg-bg-dark border-brand-subtle hover:border-brand hover:bg-brand/5'
                                }
                            `}
                        >
                            {/* Step Number */}
                            <span className={`
                                w-5 h-5 rounded-full flex items-center justify-center text-xs font-bold shrink-0
                                ${isCompleted 
                                    ? 'bg-brand text-white' 
                                    : 'bg-brand/20 border border-brand text-brand'
                                }
                            `}>
                                {isCompleted ? <Check className="w-3 h-3" /> : index + 1}
                            </span>

                            {/* Document Name Only */}
                            <span className={`
                                flex-1 text-sm font-medium
                                ${isCompleted ? 'text-gray-400 line-through' : 'text-white'}
                            `}>
                                {step.document}
                            </span>

                            {/* Arrow indicator */}
                            {!isCompleted && (
                                <ChevronRight className="w-4 h-4 text-brand/50" />
                            )}
                        </button>
                    )
                })}
            </div>

            {/* Help text */}
            <p className="text-xs text-gray-500 mt-3 text-center">
                Click pe un document pentru a vedea locația
            </p>
        </div>
    )
}

export default WorkflowSteps
