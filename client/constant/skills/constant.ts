export interface Skill {
    _id: string;
    name: string;
    score: number;
    color: string;
}

export interface GetSkillsApiResponse {
    _id: string;
    name: string;
    icon: string;
    skills: Skill[];
}
