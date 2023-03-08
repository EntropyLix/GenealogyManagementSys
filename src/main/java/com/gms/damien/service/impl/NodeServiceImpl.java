package com.gms.damien.service.impl;

import com.alibaba.fastjson2.JSON;
import com.gms.damien.service.NodeService;
import com.gms.damien.service.dto.RelastionshipDTO;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.Iterator;
import java.util.List;
import java.util.Map;
import org.neo4j.ogm.model.Node;
import org.neo4j.ogm.model.Property;
import org.neo4j.ogm.model.Result;
import org.neo4j.ogm.response.model.RelationshipModel;
import org.neo4j.ogm.session.Session;
import org.neo4j.ogm.session.SessionFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class NodeServiceImpl implements NodeService {

    @Autowired
    private SessionFactory sessionFactory;

    @Override
    public void createGroupRelastionship(Long groupId, String userId) {
        String cypher =
            "MATCH (n1:jhi_user),(n2:Group)" +
            " where n1.user_id='" +
            userId +
            "' and id(n2)=" +
            groupId +
            " merge (n2)-[r1:HAS_MEMBERS]->(n1)";
        Session session = sessionFactory.openSession();
        session.query(cypher, new HashMap<>(), false);
    }

    @Override
    public void deleteGroupRelastionshipOfFamilies(Long groupId) {
        String cypher =
            "MATCH (n1:Family)-[r1:HAS_READ]-(n2:Group),(n1:Family)-[r2:HAS_WRITE]-(n2:Group) where id(n2)=" + groupId + " delete r1,r2";
        Session session = sessionFactory.openSession();
        session.query(cypher, new HashMap<>(), false);
    }

    @Override
    public void deleteGroupRelastionshipOfUser(Long groupId) {
        String cypher = "MATCH (n1:jhi_user)-[r:HAS_MEMBERS]-(n2:Group) where id(n2)=" + groupId + " delete r";
        Session session = sessionFactory.openSession();
        session.query(cypher, new HashMap<>(), false);
    }

    @Override
    public void createRelastionship(RelastionshipDTO relastionshipDTO) {
        Long fromId = relastionshipDTO.getFromId();
        Long toId = relastionshipDTO.getToId();
        String relastionshipName = relastionshipDTO.getRelationshipName();

        String cypher =
            "MATCH (n1:FamilyMember),(n2:FamilyMember)" +
            " where id(n1)=" +
            fromId +
            " and id(n2)=" +
            toId +
            " merge (n1)-[r1:" +
            relastionshipName +
            "]->(n2)";
        Session session = sessionFactory.openSession();
        session.query(cypher, new HashMap<>(), false);
    }

    @Override
    public Map<String, Object> searchPath(Long id) {
        String cypher =
            "MATCH (n:Family) where id(n)=" +
            id +
            " " +
            "CALL apoc.path.subgraphAll(n,{relationshipFilter: '<|>',minLevel: 0,maxLevel: -1}) " +
            "YIELD nodes,relationships RETURN nodes, relationships";
        Session session = sessionFactory.openSession();
        Result reslut = session.query(cypher, new HashMap<>(), false);
        Map<String, Object> map = new HashMap<>();
        List<Map<String, Object>> path = new ArrayList<>();
        List<Object> nodes = new ArrayList<>();
        List<RelationshipModel> relationships = new ArrayList<>();
        List<Map<String, Object>> resultList = this.copyIterator(reslut.iterator());
        if (!resultList.isEmpty()) {
            nodes = (List<Object>) resultList.get(0).get("nodes");
            try {
                relationships = (List<RelationshipModel>) resultList.get(0).get("relationships");
            } catch (ClassCastException e) {
                relationships = new ArrayList<>();
            }
            map.put("nodes", toNodeList(nodes));
            if (!relationships.isEmpty()) {
                relationships.forEach(item -> {
                    Map<String, Object> itemMap = new HashMap<>();
                    itemMap.put("from", ((RelationshipModel) item).getStartNode());
                    itemMap.put("to", ((RelationshipModel) item).getEndNode());
                    itemMap.put("category", ((RelationshipModel) item).getType());
                    path.add(itemMap);
                });
                map.put("data", path);
            } else {
                nodes.forEach(res -> {
                    HashMap<String, Object> item = JSON.parseObject(JSON.toJSONString(res), HashMap.class);
                    Map<String, Object> itemMap = new HashMap<>();
                    itemMap.put("from", item.get("id"));
                    itemMap.put("to", item.get("id"));
                    path.add(itemMap);
                });
            }
            map.put("data", path);
        }
        return map;
    }

    private List<Map<String, Object>> toNodeList(List<Object> nodes) {
        List<Map<String, Object>> list = new ArrayList<>();
        nodes.forEach(item -> {
            HashMap<String, Object> entityMap = JSON.parseObject(JSON.toJSONString(item), HashMap.class);
            Map<String, Object> map = new HashMap<>();
            map.put("id", entityMap.get("id"));
            map.put("name", getClassName(item));
            // map.put("name", this.coverIterableToString(item.getLabels(),
            // item.getPropertyList()));
            map.put("properties", entityMap);
            list.add(map);
        });
        return list;
    }

    private String getClassName(Object obj) {
        return obj.getClass().getSimpleName();
    }

    private String coverIterableToString(String[] labels, List<Property<String, Object>> propertyList) {
        String text = "";
        for (String src : labels) {
            text += src + ".";
        }
        text += this.getNameFromPropertyList(propertyList);
        return text;
    }

    private String getNameFromPropertyList(List<Property<String, Object>> propertyList) {
        String[] text = { "" };
        propertyList.forEach(res -> {
            if ("name".equals((res.getKey()))) {
                text[0] = res.getValue().toString();
            }
        });
        return text[0];
    }

    private <T> List<T> copyIterator(Iterator<T> iter) {
        List<T> copy = new ArrayList<T>();
        while (iter.hasNext()) copy.add(iter.next());
        return copy;
    }
}
