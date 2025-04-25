import { model } from "mongoose";
import { BaseMongoRepository } from "../base/base_repository";
import { classe_schema, IClasseEntity, IExamenEntity } from "./classe";


export class ClasseRepository extends BaseMongoRepository<IClasseEntity> {

    async getExamens(class_id: string): Promise<IExamenEntity[]> {
        const classe = await this.model.findById(class_id).exec();
        if (!classe) {
            throw new Error("Classe not found");
        }
        return classe.examens;
    }

    async createExamen(class_id: string, examen: IExamenEntity): Promise<IExamenEntity> {
        const classe = await this.model.findById(class_id).exec();
        if (!classe) {
            throw new Error("Classe not found");
        }
        classe.examens.push(examen);
        await classe.save();
        return examen;
    }

    async updateExamen(class_id: string, examen: IExamenEntity): Promise<IExamenEntity> {
        const classe = await this.model.findById(class_id).exec();
        if (!classe) {
            throw new Error("Classe not found");
        }
        const examenIndex = classe.examens.findIndex((e) => e._id.toString() === examen._id.toString());
        if (examenIndex === -1) {
            throw new Error("Examen not found");
        }
        classe.examens[examenIndex] = examen;
        await classe.save();
        return examen;
    }

    async deleteExamen(class_id: string, examen_id: string): Promise<boolean> {
        const classe = await this.model.findById(class_id).exec();
        if (!classe) {
            throw new Error("Classe not found");
        }
        const examenIndex = classe.examens.findIndex((e) => e._id.toString() === examen_id.toString());
        if (examenIndex === -1) {
            throw new Error("Examen not found");
        }
        classe.examens.splice(examenIndex, 1);
        await classe.save();
        return true;
    }

}

const classe_model = model<IClasseEntity>("Classe", classe_schema);
export const classe_repository = new ClasseRepository(classe_model);