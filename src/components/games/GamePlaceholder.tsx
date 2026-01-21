import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Clock, Gamepad2, ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface GamePlaceholderProps {
    title: string;
}

export default function GamePlaceholder({ title }: GamePlaceholderProps) {
    const navigate = useNavigate();

    return (
        <div className="flex flex-col items-center justify-center min-h-[400px] w-full p-6">
            <Card className="max-w-md w-full border-2 border-dashed border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-900/50">
                <CardContent className="flex flex-col items-center text-center pt-10 pb-10 space-y-6">
                    <div className="w-20 h-20 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center mb-2 animate-pulse">
                        <Gamepad2 className="w-10 h-10 text-slate-400 dark:text-slate-500" />
                    </div>

                    <div className="space-y-2">
                        <h3 className="text-2xl font-bold text-slate-900 dark:text-slate-100">
                            {title}
                        </h3>
                        <p className="text-slate-500 dark:text-slate-400 font-medium flex items-center justify-center gap-2">
                            <Clock className="w-4 h-4" /> Coming Soon
                        </p>
                    </div>

                    <p className="text-slate-600 dark:text-slate-400 text-sm max-w-xs mx-auto">
                        We're currently polishing the pixels for this game.
                        Check back later for the ultimate gaming experience!
                    </p>

                    <div className="pt-4 w-full">
                        <Button
                            variant="outline"
                            className="w-full gap-2 border-slate-300 dark:border-slate-700"
                            onClick={() => navigate('/games')}
                        >
                            <ArrowLeft className="w-4 h-4" /> Back to Games Galaxy
                        </Button>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
