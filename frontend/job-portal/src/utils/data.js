import {Search,Users,FileText,MessageSquare,BarChart3,Shield,Clock,Award,Briefcase,Building2,LayoutDashboard,Plus} from "lucide-react";
export const jobSeekerFeatures = [
    {
        icon: Search,
        title: "Smart Job Matching",
        description: "Our advanced algorithms match you with the most relevant job opportunities based on your skills and preferences."
    },{
        icon: FileText,
        title: "Resume Builder",
        description: "Create a professional resume effortlessly with our easy-to-use resume builder, tailored to highlight your strengths."
    },{
        icon: MessageSquare,
        title: "Direct Communication",
        description: "Communicate directly with employers through our secure messaging platform, ensuring a seamless application process."
    },{
        icon: Award,
        title: "Skill Assessments",
        description: "Take skill assessments to showcase your expertise and increase your chances of landing your dream job."
    }];
export const employerFeatures = [
    {
        icon: Users,
        title: "Talent Pool Access",
        description: "Access a vast pool of qualified candidates and find the perfect fit for your job openings."
    },{
        icon: BarChart3,
        title: "Analytics Dashboard",
        description: "Gain insights into your hiring process with our comprehensive analytics dashboard."
    },{
        icon: Shield,
        title: "Background Checks",
        description: "Perform background checks on shortlisted candidates to ensure a safe hiring process."
    },{
        icon: Clock,
        title: "Interview Scheduling",
        description: "Schedule and manage interviews with candidates efficiently."
    }];
// Navigation items configuration
export const NAVIGATION_MENU=[
    {id:"employer-dashboard",name:"Dashboard",icon:LayoutDashboard},
    {id:"post-job",name:"Post Job",icon:Plus},
    {id:"manage-jobs",name:"Manage Jobs",icon:Briefcase},
    {id:"applicants",name:"Applicants",icon:Users},
    {id:"company-profile",name:"Company Profile",icon:Building2},
];

//categories and job types
export const CATEGORIES = [
    {value: "Engineering", label: "Engineering"},
    {value: "Design", label: "Design"},
    {value: "Marketing", label: "Marketing"},
    {value: "Sales", label: "Sales"},
     {value: "IT & Software", label: "IT & Software"},
    {value: "Customer Support", label: "Customer Support"},
    {value: "Human Resources", label: "Human Resources"},
    {value: "Finance", label: "Finance"},
    {value: "Healthcare", label: "Healthcare"},
    {value: "Other", label: "Other"},
];
export const JOB_TYPES = [
    {value: "Full-time", label: "Full-time"},
    {value: "Part-time", label: "Part-time"},
    {value: "Contract", label: "Contract"},
    {value: "Internship", label: "Internship"},
    {value: "Remote", label: "Remote"},
];
export const SALARY_RANGES = [
    "Less than $10,000",
    "$10,000 - $20,000",
    "More than $20,000",
];