import { useState, useEffect } from "react";
import { endorsementService } from "../services/AllService";

type EndorsementRecord = Awaited<
    ReturnType<typeof endorsementService.getEndorsement>
>[number];

export const useEndorsements = () => {
    const [endorsements, setEndorsements] = useState<EndorsementRecord[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        endorsementService
            .getEndorsement()
            .then((data) => setEndorsements(data))
            .finally(() => setLoading(false));
    }, []);

    return { endorsements, loading };
};
